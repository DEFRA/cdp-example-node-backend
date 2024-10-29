import Joi from 'joi'

export const statusCodeController = {
  options: {
    validate: {
      params: Joi.object({
        code: Joi.number().integer().min(100).max(599).required()
      })
    }
  },
  handler: (request, h) => {
    return h.response().code(Number(request.params.code))
  }
}
