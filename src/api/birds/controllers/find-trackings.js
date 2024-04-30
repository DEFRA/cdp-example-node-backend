import Joi from 'joi'
import Boom from '@hapi/boom'
// import { isNull } from 'lodash'

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

    //  if (isNull(trackings)) {
    //    return Boom.boomify(Boom.notFound())
    //  }

    return h.response({ message: 'success', trackings }).code(200)
  }
}

export { findTrackingsController }
