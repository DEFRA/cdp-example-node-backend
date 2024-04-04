import { getAnimals } from '~/src/api/animals/helpers/get-animals'

const animalsListController = {
  handler: async (request, h) => {
    const animals = await getAnimals(request.db)

    return h.response({ message: 'success', animals }).code(200)
  }
}

export { animalsListController }
