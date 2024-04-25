import {
  plantController,
  createPlantController,
  plantsListController
} from '~/src/api/plants/controllers'

const plants = {
  plugin: {
    name: 'plants',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/plants',
          ...plantsListController
        },
        {
          method: 'POST',
          path: '/plants',
          ...createPlantController
        },
        {
          method: 'GET',
          path: '/plants/{plantId}',
          ...plantController
        }
      ])
    }
  }
}

export { plants }
