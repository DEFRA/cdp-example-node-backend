import Joi from 'joi'

// Test endpoints, see example-api.md
export const exampleApi = [
  {
    method: ['*'],
    path: '/api/ok',
    handler: (_request, h) => h.response('ok').code(200)
  },
  {
    method: ['GET'],
    path: '/api/json',
    handler: (_request, h) =>
      h
        .response({
          key: '123',
          value: 'abc',
          bool: true,
          number: 42,
          array: [1, 2, 3],
          obj: { foo: 'bar' }
        })
        .code(200)
  },
  {
    method: ['POST', 'PUT', 'PATCH'],
    path: '/api/json',
    options: {
      payload: {
        allow: ['application/json', 'application/*+json']
      },
      validate: {
        payload: Joi.object({}).unknown(true)
      }
    },
    handler: (request, h) => h.response(request.payload).code(200)
  },
  {
    method: ['POST', 'PUT', 'PATCH'],
    path: '/api/multipart',
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'file',
        parse: false,
        timeout: false
      }
    },
    handler: (request, h) => {
      const keys = Object.keys(request.payload).join(', ')
      return h.response(`multipart accepted with keys ${keys}`).code(200)
    }
  },
  {
    method: ['*'],
    path: '/api/long-path/{path*}',
    handler: (request, h) =>
      h.response({ requestedPath: request.params.path }).code(200)
  },
  {
    method: ['*'],
    path: '/api/headers',
    handler: (_request, h) =>
      h
        .response('ok')
        .code(200)
        .header('x-custom-header', 'test123')
        .header('X-SOME-VALUE', 'SomeValue')
  },
  {
    method: ['*'],
    path: '/api/error/{code}',
    options: {
      validate: {
        params: Joi.object({
          code: Joi.number().integer().min(100).max(599).required()
        })
      }
    },
    handler: (request, h) => h.response().code(Number(request.params.code))
  },
  {
    method: ['*'],
    path: '/api/echo',
    handler: (request, h) => {
      request.logger.info(
        'Headers: ' + JSON.stringify(request.headers, null, 2)
      )
      request.logger.info('Body: ' + request.payload)
      return h.response(request.payload).code(200)
    }
  }
]
