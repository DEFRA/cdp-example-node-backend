import Joi from 'joi'

export const getJsonController = {
  handler: (request, h) => {
    return h
      .response({
        key: '123',
        value: 'abc',
        bool: true,
        number: 42,
        array: [1, 2, 3],
        obj: { foo: 'bar' }
      })
      .code(200)
  }
}

export const sendJsonController = {
  options: {
    payload: {
      allow: ['application/json', 'application/*+json']
    },
    validate: {
      payload: Joi.object({}).unknown(true)
    }
  },
  handler: (request, h) => {
    return h.response(request.payload).code(200)
  }
}
