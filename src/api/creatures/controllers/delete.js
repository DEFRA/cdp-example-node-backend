import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'
import { deleteCreature } from '~/src/api/creatures/helpers/delete-creature'

const deleteCreatureController = {
  options: {
    validate: {
      params: Joi.object({
        creatureId: Joi.string().required()
      })
    }
  },
  handler: async (request, h) => {
    const creature = await deleteCreature(request.db, request.params.creatureId)

    if (isNull(creature)) {
      return Boom.boomify(Boom.notFound())
    }

    return h.response({ message: 'success', creature }).code(200)
  }
}

export { deleteCreatureController }
