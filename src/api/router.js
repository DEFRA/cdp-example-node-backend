import { health } from '~/src/api/health'
import { animals } from '~/src/api/animals'
import { callback } from '~/src/api/callback'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health, animals, callback])
    }
  }
}

export { router }
