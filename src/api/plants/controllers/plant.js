import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'

import { getPlant } from '~/src/api/plants/helpers/get-plant'

const plantController = {
  options: {
    validate: {
      params: Joi.object({
        plantId: Joi.string().required()
      })
    }
  },
  handler: async (request, h) => {
    const plant = await getPlant(request.db, request.params.plantId)

    if (isNull(plant)) {
      return Boom.boomify(Boom.notFound())
    }

    return h.response({ message: 'success', plant }).code(200)
  }
}

export { plantController }
