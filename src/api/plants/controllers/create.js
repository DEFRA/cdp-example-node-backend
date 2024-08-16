import Joi from 'joi'

import { createPlant } from '~/src/api/plants/helpers/create-plant'

const file = Joi.object({
  filename: Joi.string().required(),
  fileUrl: Joi.string().required()
})

const createPlantController = {
  options: {
    validate: {
      payload: Joi.object({
        plantId: Joi.string().uuid().required(),
        name: Joi.string().required(),
        files: Joi.array().items(file)
      })
    }
  },
  handler: async (request, h) => {
    const plant = await createPlant(request.db, request.payload)

    return h.response({ message: 'success!', plant }).code(200)
  }
}

export { createPlantController }
