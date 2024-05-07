import { getCreatures } from '~/src/api/creatures/helpers/get-creatures'

const creaturesListController = {
  handler: async (request, h) => {
    const creatures = await getCreatures(request.db)

    return h.response({ message: 'success', creatures }).code(200)
  }
}

export { creaturesListController }
