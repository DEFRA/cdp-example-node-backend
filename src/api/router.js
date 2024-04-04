import { health } from '~/src/api/health'
import { animals } from '~/src/api/animals'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health, animals])
    }
  }
}

export { router }
