import Joi from 'joi'
import { isNull } from 'lodash'

import { findTracking } from '~/src/api/birds/helpers/find-tracking'
import {
  updateTrackingFile,
  updateTrackingStatus
} from '~/src/api/birds/helpers/update-tracking'
import {
  trackingStatus,
  uploadStatus,
  uploadStatuses
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
    const files = payload?.files

    request.logger.debug(
      { birdId, trackingId, tracking, payload, files },
      'Tracking callback'
    )

    const uploadedStatus = payload?.uploadStatus?.toLowerCase()
    const s3Bucket = payload?.destinationBucket
    const s3Key = files?.map((file) => file.s3Key)?.[0]
    const filename = files?.map((file) => file.filename)?.[0]
    const contentType = files?.map((file) => file.contentType)?.[0]
    const contentLength = files?.map((file) => file.contentLength)?.[0]
    const isCsv = contentType === 'text/csv'

    if (!uploadedStatus || !uploadStatuses.includes(uploadedStatus)) {
      request.logger.warn({ trackingId }, `Unknown status: ${uploadedStatus}`)
      return h.response({ message: 'Unknown upload status' }).code(400)
    }

    if (!s3Key) {
      request.logger.warn({ trackingId }, `No s3Key`)
      return h.response({ message: 'No s3Key' }).code(400)
    }

    if (uploadedStatus === uploadStatus.rejected) {
      tracking.trackingStatus = trackingStatus.rejected
      request.logger.warn(
        { trackingId, s3Key, tracking },
        'File was rejected by uploader'
      )
    }

    if (uploadedStatus === uploadStatus.ready && !isCsv) {
      tracking.trackingStatus = trackingStatus.rejected
      request.logger.warn({ trackingId, s3Key, tracking }, 'File is not CSV')
    }

    if (uploadedStatus === uploadStatus.ready && isCsv) {
      tracking.trackingStatus = trackingStatus.readyforprocessing
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
