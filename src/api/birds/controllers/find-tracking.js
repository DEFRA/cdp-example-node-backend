import Joi from 'joi'
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

    let { tracking } = await findTracking(request.db, birdId, trackingId)

    if (isNull(tracking) || !tracking?.trackingId) {
      request.logger.info(
        { birdId, trackingId, tracking },
        `Could not find tracking [${trackingId}]`
      )
      return h.response({ message: `Could not find tracking` }).code(404)
    }

    request.logger.debug(
      { birdId, trackingId, tracking },
      'Found tracking in get tracking'
    )

    await simulateProcessing(request, tracking)
    tracking = await findTracking(request.db, birdId, trackingId)

    return h.response({ tracking }).code(200)
  }
}

export { findTrackingController }
