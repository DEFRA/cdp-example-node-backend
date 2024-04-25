import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'

import { getAnimal } from '~/src/api/animals/helpers/get-animal'

const animalController = {
  options: {
    validate: {
      params: Joi.object({
        animalId: Joi.string().hex().length(24).required()
      })
    }
  },
  handler: async (request, h) => {
    const animal = await getAnimal(request.db, request.params.animalId)

    if (isNull(animal)) {
      return Boom.boomify(Boom.notFound())
    }

    return h.response({ message: 'success', animal }).code(200)
  }
}

export { animalController }
