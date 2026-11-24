import { health } from '#/routes/health.js'
import { testEndpoints } from '#/routes/test-endpoints.js'
import { uploads } from '#/routes/uploads/index.js'

export const router = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route([health].concat(uploads, testEndpoints))
    }
  }
}
