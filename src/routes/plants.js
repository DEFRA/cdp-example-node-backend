import Joi from 'joi'
import Boom from '@hapi/boom'

import { createPlant, getPlant, getPlants } from '#/services/plants.js'

const file = Joi.object({
  filename: Joi.string().required(),
  fileUrl: Joi.string().required()
})

export const plants = [
  {
    method: 'GET',
    path: '/plants',
    handler: async (request, h) => {
      const plants = await getPlants(request.db)

      return h.response({ message: 'success', plants }).code(200)
    }
  },
  {
    method: 'POST',
    path: '/plants',
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

      return h.response({ message: 'success', plant }).code(200)
    }
  },
  {
    method: 'GET',
    path: '/plants/{plantId}',
    options: {
      validate: {
        params: Joi.object({
          plantId: Joi.string().uuid().required()
        })
      }
    },
    handler: async (request, h) => {
      const plant = await getPlant(request.db, request.params.plantId)

      if (plant === null) {
        return Boom.boomify(Boom.notFound())
      }

      return h.response({ message: 'success', plant }).code(200)
    }
  }
]
