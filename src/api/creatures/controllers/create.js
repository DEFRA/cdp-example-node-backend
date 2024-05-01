import Joi from 'joi'
import { createCreature } from '~/src/api/creatures/helpers/create-creature'

const createCreatureController = {
  options: {
    validate: {
      payload: Joi.object({
        creatureId: Joi.string().required(),
        kind: Joi.string().required(),
        creatureFileUrls: Joi.array().items(Joi.string()).required(),
        date: Joi.date().required(),
        dream: Joi.bool().required(),
        address: Joi.object({
          addressLine1: Joi.string().required(),
          addressLine2: Joi.string().optional(),
          townOrCity: Joi.string().required(),
          postCode: Joi.string().required()
        }).optional(),
        evidenceFileUrls: Joi.array().items(Joi.string()).optional()
      })
    }
  },
  handler: async (request, h) => {
    const creature = await createCreature(request.db, request.payload)

    return h.response({ message: 'success', creature }).code(200)
  }
}

export { createCreatureController }
