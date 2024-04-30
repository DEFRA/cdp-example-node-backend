import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'

import { findTracking } from '~/src/api/birds/helpers/find-tracking'

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
    const tracking = await findTracking(request.db, birdId, trackingId)

    if (isNull(tracking)) {
      return Boom.boomify(Boom.notFound())
    }

    return h.response({ message: 'success', tracking }).code(200)
  }
}

export { findTrackingController }
