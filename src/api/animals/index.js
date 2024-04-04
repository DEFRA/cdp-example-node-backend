import {
  animalController,
  createAnimalController,
  animalsListController
} from '~/src/api/animals/controllers'

const animals = {
  plugin: {
    name: 'entities',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/animals',
          ...animalsListController
        },
        {
          method: 'POST',
          path: '/animals',
          ...createAnimalController
        },
        {
          method: 'GET',
          path: '/animals/{animalId}',
          ...animalController
        }
      ])
    }
  }
}

export { animals }
