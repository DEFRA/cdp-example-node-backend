import { callbackController } from '~/src/api/callback/controller'

const callback = {
  plugin: {
    name: 'callback',
    register: async (server) => {
      server.route([
        {
          method: 'POST',
          path: '/callback',
          ...callbackController
        }
      ])
    }
  }
}

export { callback }
