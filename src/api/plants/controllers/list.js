import { getPlants } from '~/src/api/plants/helpers/get-plants'

const plantsListController = {
  handler: async (request, h) => {
    const plants = await getPlants(request.db)

    return h.response({ message: 'success', plants }).code(200)
  }
}

export { plantsListController }
