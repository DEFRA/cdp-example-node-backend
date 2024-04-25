import { health } from '~/src/api/health'
import { animals } from '~/src/api/animals'
import { callback } from '~/src/api/callback'
import { plants } from '~/src/api/plants'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health, animals, plants, callback])
    }
  }
}

export { router }
