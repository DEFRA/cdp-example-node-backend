import Joi from 'joi'
import { isNull } from 'lodash'

import { findTracking } from '~/src/api/birds/helpers/find-tracking'
import {
  updateTrackingFile,
  updateTrackingStatus
} from '~/src/api/birds/helpers/update-tracking'
import {
  fileStatus,
  trackingStatus,
  uploadStatus
} from '~/src/api/birds/helpers/tracking-status'

const callbackTrackingController = {
  options: {
    validate: {
      params: Joi.object({
        birdId: Joi.number().integer().positive().required(),
        trackingId: Joi.string().uuid().required()
      })
    }
  },
  handler: async (request, h) => {
    const birdId = request.params.birdId
    const trackingId = request.params.trackingId

    const { tracking } = await findTracking(request.db, birdId, trackingId)

    if (isNull(tracking)) {
      request.logger.warn(
        { birdId, trackingId },
        'Could not find tracking for callback'
      )
      return h
        .response({ message: 'Could not find tracking callback' })
        .code(404)
    }

    const payload = request.payload
    const file = payload?.form?.file

    request.logger.debug(
      { birdId, trackingId, tracking, payload, file },
      'Tracking callback'
    )

    const uploadedStatus = payload?.uploadStatus
    const s3Key = file?.s3Key
    const contentType = file?.contentType

    if (uploadedStatus !== uploadStatus.ready) {
      request.logger.warn({ trackingId }, `Unknown status: ${uploadedStatus}`)
      return h.response({ message: 'Unknown upload status' }).code(204)
    }

    if (file?.fileStatus === fileStatus.complete) {
      tracking.trackingStatus = trackingStatus.readyforprocessing
      const s3Bucket = payload?.destinationBucket
      const filename = file.filename
      const contentLength = file.contentLength
      tracking.fileDetails = {
        s3Key,
        s3Bucket,
        filename,
        contentType,
        contentLength
      }
      const updateFileResponse = await updateTrackingFile(
        request.db,
        trackingId,
        tracking.fileDetails
      )

      if (!updateFileResponse) {
        return h.response({ message: 'error' }).code(500)
      }
    } else {
      request.logger.warn(
        { trackingId, s3Key, tracking, file },
        'File was rejected by uploader'
      )
      tracking.trackingStatus = trackingStatus.rejected
    }

    const updateStatusResponse = await updateTrackingStatus(
      request.db,
      trackingId,
      tracking.trackingStatus
    )
    if (!updateStatusResponse) {
      return h.response({ message: 'error' }).code(500)
    }

    request.logger.info(
      { tracking, trackingId, birdId },
      'Tracking callback updated successfully'
    )

    return h.response().code(204)
  }
}

export { callbackTrackingController }
