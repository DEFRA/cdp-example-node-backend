import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'
import { getCreature } from '~/src/api/creatures/helpers/get-creature'

const creatureController = {
  options: {
    validate: {
      params: Joi.object({
        creatureId: Joi.string().uuid().required()
      })
    }
  },
  handler: async (request, h) => {
    const creature = await getCreature(request.db, request.params.creatureId)

    if (isNull(creature)) {
      return Boom.boomify(Boom.notFound())
    }

    return h.response({ message: 'success', creature }).code(200)
  }
}

export { creatureController }
