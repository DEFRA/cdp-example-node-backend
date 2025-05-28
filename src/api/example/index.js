import { okController } from '~/src/api/example/controllers/ok-controller'
import {
  getJsonController,
  sendJsonController
} from '~/src/api/example/controllers/json-controller'
import { statusCodeController } from '~/src/api/example/controllers/status-code-controller'
import { multipartController } from '~/src/api/example/controllers/multipart-controller'
import { longPathController } from '~/src/api/example/controllers/long-path-controller'
import { headerController } from '~/src/api/example/controllers/header-controller'
import { callPublic } from '~/src/api/example/controllers/call-public'

export const exampleApi = {
  plugin: {
    name: 'exampleApi',
    register: async (server) => {
      server.route([
        {
          method: ['*'],
          path: '/api/ok',
          ...okController
        },
        {
          method: ['GET'],
          path: '/api/json',
          ...getJsonController
        },
        {
          method: ['POST', 'PUT', 'PATCH'],
          path: '/api/json',
          ...sendJsonController
        },
        {
          method: ['POST', 'PUT', 'PATCH'],
          path: '/api/multipart',
          ...multipartController
        },
        {
          method: ['*'],
          path: '/api/long-path/{path*}',
          ...longPathController
        },
        {
          method: ['*'],
          path: '/api/headers',
          ...headerController
        },
        {
          method: ['*'],
          path: '/api/error/{code}',
          ...statusCodeController
        },
        {
          method: ['GET'],
          path: '/call-public',
          ...callPublic
        }
      ])
    }
  }
}
