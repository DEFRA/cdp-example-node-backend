import Joi from 'joi'

import { createPlant } from '~/src/api/plants/helpers/create-plant'

const createPlantController = {
  options: {
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        fileUrl: Joi.string().required()
      })
    }
  },
  handler: async (request, h) => {
    const plant = await createPlant(request.db, request.payload)

    return h.response({ message: 'success', plant }).code(200)
  }
}

export { createPlantController }
