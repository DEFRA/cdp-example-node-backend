import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'

import { findTracking } from '~/src/api/birds/helpers/find-tracking'
import { simulateProcessing } from '~/src/api/birds/helpers/simulate-processing'

const findTrackingController = {
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

    request.logger.debug({ birdId, trackingId, tracking }, 'Found tracking')

    if (isNull(tracking)) {
      return Boom.boomify(Boom.notFound())
    }

    simulateProcessing(request, tracking)

    return h.response({ tracking }).code(200)
  }
}

export { findTrackingController }
