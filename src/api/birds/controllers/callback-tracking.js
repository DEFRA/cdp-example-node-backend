import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'

import { findTracking } from '~/src/api/birds/helpers/find-tracking'
import {
  updateTrackingFile,
  updateTrackingStatus
} from '~/src/api/birds/helpers/update-tracking'

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

    const tracking = await findTracking(request.db, birdId, trackingId)

    if (isNull(tracking)) {
      return Boom.boomify(Boom.notFound())
    }

    const payload = request.payload
    const files = payload?.files
    const fields = payload?.fields

    console.log(
      { birdId, trackingId, tracking, payload, files, fields },
      'Tracking callback'
    )

    const uploadStatus = payload?.uploadStatus
    const s3Bucket = payload?.destinationBucket
    const s3Key = files?.map((file) => file.s3Key)?.[0]
    const filename = files?.map((file) => file.filename)?.[0]
    const contentType = files?.map((file) => file.contentType)?.[0]

    if (uploadStatus && s3Key && uploadStatus === 'ready') {
      tracking.status = 'ReadyForProcessing'
      tracking.fileDetails = {
        s3Key,
        s3Bucket,
        filename,
        contentType
      }
      const updateFileResponse = await updateTrackingFile(
        request.db,
        trackingId,
        tracking.fileDetails
      )

      if (!updateFileResponse) {
        return h.response({ message: 'error' }).code(500)
      }
    } else if (uploadStatus && uploadStatus === 'rejected') {
      tracking.status = 'Rejected'
    } else {
      console.log({ uploadStatus, s3Key, tracking }, 'Unknown status')
      return h.response({ message: 'Unknown status' }).code(400)
    }

    const updateStatusResponse = await updateTrackingStatus(
      request.db,
      trackingId,
      tracking.status
    )
    if (!updateStatusResponse) {
      return h.response({ message: 'error' }).code(500)
    }

    console.log(
      { tracking },
      'Tracking set to ready for processing or rejected'
    )

    return h.response().code(204)
  }
}

export { callbackTrackingController }
