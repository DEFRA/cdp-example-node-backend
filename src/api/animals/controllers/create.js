import Joi from 'joi'

import { createAnimal } from '~/src/api/animals/helpers/create-animal'
import { counter } from '~/src/helpers/metrics/metrics'

const file = Joi.object({
  filename: Joi.string().required(),
  uploadId: Joi.string().uuid().required(),
  fileId: Joi.string().uuid().required(),
  fileUrl: Joi.string().required()
})

const createAnimalController = {
  options: {
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        kind: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        file
      })
    }
  },
  handler: async (request, h) => {
    const animal = await createAnimal(request.db, request.payload)
    await counter('animals-created')
    return h.response({ message: 'success', animal }).code(200)
  }
}

export { createAnimalController }
