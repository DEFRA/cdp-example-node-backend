import { health } from '~/src/api/health'
import { animals } from '~/src/api/animals'
import { callback } from '~/src/api/callback'
import { plants } from '~/src/api/plants'
import { creatures } from '~/src/api/creatures'
import { birds } from '~/src/api/birds'
import { environmentVariables } from '~/src/api/variables'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([
        health,
        animals,
        birds,
        callback,
        creatures,
        plants,
        environmentVariables
      ])
    }
  }
}

export { router }
