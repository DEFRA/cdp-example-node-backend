import { health } from '#/routes/health.js'
import { animals } from '#/routes/animals.js'
import { birds } from '#/routes/birds.js'
import { callback } from '#/routes/callback.js'
import { creatures } from '#/routes/creatures.js'
import { plants } from '#/routes/plants.js'
import { exampleApi } from '#/routes/example-api.js'

export const router = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route(
        [health].concat(animals, birds, callback, creatures, plants, exampleApi)
      )
    }
  }
}
