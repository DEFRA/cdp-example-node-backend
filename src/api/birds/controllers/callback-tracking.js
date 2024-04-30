import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'

import { findTracking } from '~/src/api/birds/helpers/find-tracking'

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

    console.log({ birdId, trackingId, tracking, payload }, 'Tracking callback')

    const uploadStatus = payload?.uploadStatus
    if (uploadStatus && uploadStatus === 'ready') {
      tracking.status = 'ReadyForProcessing'
    } else if (uploadStatus && uploadStatus === 'rejected') {
      tracking.status = 'Rejected'
    } else {
    }
    //  await updateTrackingStatusAsReady(request.db, trackingId, statusUrl)

    return h.response({ message: 'success', tracking }).code(204)
  }
}

export { callbackTrackingController }
