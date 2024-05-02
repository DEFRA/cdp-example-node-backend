import {
  createCreatureController,
  creatureController,
  creaturesListController,
  deleteCreatureController
} from '~/src/api/creatures/controllers'

const creatures = {
  plugin: {
    name: 'creatures',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/creatures',
          ...creaturesListController
        },
        {
          method: 'POST',
          path: '/creatures',
          ...createCreatureController
        },
        {
          method: 'GET',
          path: '/creatures/{creatureId}',
          ...creatureController
        },
        {
          method: 'DELETE',
          path: '/creatures/{creatureId}',
          ...deleteCreatureController
        }
      ])
    }
  }
}

export { creatures }
