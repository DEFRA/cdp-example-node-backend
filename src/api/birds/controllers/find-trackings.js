import Joi from 'joi'

import { findTrackings } from '~/src/api/birds/helpers/find-trackings'

const findTrackingsController = {
  options: {
    validate: {
      params: Joi.object({
        birdId: Joi.number().integer().positive().required()
      })
    }
  },
  handler: async (request, h) => {
    const birdId = request.params.birdId
    const trackings = await findTrackings(request.db, birdId)

    return h.response({ trackings }).code(200)
  }
}

export { findTrackingsController }
