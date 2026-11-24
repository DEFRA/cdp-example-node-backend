import { createRequire } from 'node:module'
import Joi from 'joi'

import { statusCodes } from '#/common/constants/status-codes.js'

const exampleJson = createRequire(import.meta.url)(
  './test-endpoints-example.json'
)

const minStatusCode = 100
const maxStatusCode = 599

// Test endpoints, see test-endpoints.md
export const testEndpoints = [
  {
    method: ['*'],
    path: '/api/ok',
    handler: (_request, h) => h.response('ok')
  },
  {
    method: ['GET'],
    path: '/api/json',
    handler: (_request, h) => h.response(exampleJson)
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
    handler: (request, h) => h.response(request.payload)
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
      return h.response(`multipart accepted with keys ${keys}`)
    }
  },
  {
    method: ['*'],
    path: '/api/long-path/{path*}',
    handler: (request, h) => h.response({ requestedPath: request.params.path })
  },
  {
    method: ['*'],
    path: '/api/headers',
    handler: (_request, h) =>
      h
        .response('ok')
        .header('x-custom-header', 'test123')
        .header('X-SOME-VALUE', 'SomeValue')
  },
  {
    method: ['*'],
    path: '/api/error/{code}',
    options: {
      validate: {
        params: Joi.object({
          code: Joi.number()
            .integer()
            .min(minStatusCode)
            .max(maxStatusCode)
            .required()
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
      // Explicit: hapi would default to 204 for an empty payload
      return h.response(request.payload).code(statusCodes.ok)
    }
  }
]
