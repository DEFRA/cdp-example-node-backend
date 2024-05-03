import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'

import { createTracking } from '~/src/api/birds/helpers/create-tracking'

const createTrackingController = {
  options: {
    validate: {
      params: Joi.object({
        birdId: Joi.number().integer().positive().required()
      }),
      payload: Joi.object({
        spotter: Joi.string().required()
      })
    }
  },
  handler: async (request, h) => {
    const birdId = request.params.birdId
    const spotter = request.payload.spotter

    const tracking = await createTracking(request.db, birdId, spotter)
    request.logger.info(
      { birdId, tracking },
      'Created a tracking for birdId and spotter'
    )

    if (isNull(tracking)) {
      return Boom.boomify(Boom.notFound())
    }

    return h.response({ tracking }).code(200)
  }
}

export { createTrackingController }
