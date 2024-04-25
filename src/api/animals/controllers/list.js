import { getAnimals } from '~/src/api/animals/helpers/get-animals'
import { counter } from '~/src/helpers/metrics/metrics'

const animalsListController = {
  handler: async (request, h) => {
    const animals = await getAnimals(request.db)
    await counter('animals-list')
    return h.response({ message: 'success', animals }).code(200)
  }
}

export { animalsListController }
