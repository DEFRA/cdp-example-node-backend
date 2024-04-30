import { health } from '~/src/api/health'
import { animals } from '~/src/api/animals'
import { callback } from '~/src/api/callback'
import { plants } from '~/src/api/plants'
import { birds } from '~/src/api/birds'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health, animals, plants, birds, callback])
    }
  }
}

export { router }
