import Joi from 'joi'
import { createCreature } from '~/src/api/creatures/helpers/create-creature'

const file = Joi.object({
  filename: Joi.string().required(),
  fileId: Joi.string().uuid().required(),
  fileUrl: Joi.string().required()
})

// TODO with
const createCreatureController = {
  options: {
    validate: {
      payload: Joi.object({
        creatureId: Joi.string().uuid().required(),
        kind: Joi.string().required(),
        creatureFiles: Joi.array().items(file),
        date: Joi.date().required(),
        dream: Joi.bool().required(),
        address: Joi.when('dreamSighting', {
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
}

export { createCreatureController }
