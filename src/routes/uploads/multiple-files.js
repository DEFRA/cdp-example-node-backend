import Joi from 'joi'
import Boom from '@hapi/boom'

import {
  createCreature,
  deleteCreature,
  getCreature,
  getCreatures
} from '#/services/uploads/multiple-files.js'

const file = Joi.object({
  filename: Joi.string().required(),
  fileId: Joi.string().uuid().required(),
  fileUrl: Joi.string().required()
})

export const multipleFiles = [
  {
    method: 'GET',
    path: '/uploads/multiple-files/creatures',
    handler: async (request, h) => {
      const creatures = await getCreatures(request.db)

      return h.response({ message: 'success', creatures }).code(200)
    }
  },
  {
    method: 'POST',
    path: '/uploads/multiple-files/creatures',
    options: {
      validate: {
        payload: Joi.object({
          creatureId: Joi.string().uuid().required(),
          name: Joi.string().required(),
          kind: Joi.string().required(),
          creatureFiles: Joi.array().items(file),
          date: Joi.date().required(),
          realLifeSighting: Joi.bool().required(),
          address: Joi.when('realLifeSighting', {
            is: true,
            then: Joi.object({
              addressLine1: Joi.string().required(),
              addressLine2: Joi.string().optional(),
              townOrCity: Joi.string().required(),
              postCode: Joi.string().required()
            })
          }).optional(),
          evidenceFiles: Joi.array().items(file)
        })
      }
    },
    handler: async (request, h) => {
      const creature = await createCreature(request.db, request.payload)

      return h.response({ message: 'success', creature }).code(200)
    }
  },
  {
    method: 'GET',
    path: '/uploads/multiple-files/creatures/{creatureId}',
    options: {
      validate: {
        params: Joi.object({
          creatureId: Joi.string().uuid().required()
        })
      }
    },
    handler: async (request, h) => {
      const creature = await getCreature(request.db, request.params.creatureId)

      if (creature === null) {
        return Boom.boomify(Boom.notFound())
      }

      return h.response({ message: 'success', creature }).code(200)
    }
  },
  {
    method: 'DELETE',
    path: '/uploads/multiple-files/creatures/{creatureId}',
    options: {
      validate: {
        params: Joi.object({
          creatureId: Joi.string().required()
        })
      }
    },
    handler: async (request, h) => {
      const creature = await deleteCreature(
        request.db,
        request.params.creatureId
      )

      if (creature === null) {
        return Boom.boomify(Boom.notFound())
      }

      return h.response({ message: 'success', creature }).code(200)
    }
  }
]
