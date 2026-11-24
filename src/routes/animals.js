import Joi from 'joi'
import Boom from '@hapi/boom'

import { createAnimal, getAnimal, getAnimals } from '#/services/animals.js'

const file = Joi.object({
  filename: Joi.string().required(),
  fileUrl: Joi.string().required()
})

export const animals = [
  {
    method: 'GET',
    path: '/animals',
    handler: async (request, h) => {
      const animals = await getAnimals(request.db)
      await request.metrics.counter('animals-list')
      return h.response({ message: 'success', animals }).code(200)
    }
  },
  {
    method: 'POST',
    path: '/animals',
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
      await request.metrics.counter('animals-created')
      return h.response({ message: 'success', animal }).code(200)
    }
  },
  {
    method: 'GET',
    path: '/animals/{animalId}',
    options: {
      validate: {
        params: Joi.object({
          animalId: Joi.string().hex().length(24).required()
        })
      }
    },
    handler: async (request, h) => {
      const animal = await getAnimal(request.db, request.params.animalId)

      if (animal === null) {
        return Boom.boomify(Boom.notFound())
      }

      return h.response({ message: 'success', animal }).code(200)
    }
  }
]
