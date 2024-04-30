import {
  createTrackingController,
  findTrackingController,
  findTrackingsController,
  updateTrackingStatusUrlController
} from '~/src/api/birds/controllers'

const plants = {
  plugin: {
    name: 'plants',
    register: async (server) => {
      server.route([
        {
          method: 'POST',
          path: '/birds/{birdId}/tracking/{trackingId}/status-url',
          ...updateTrackingStatusUrlController
        },
        {
          method: 'GET',
          path: '/birds/{birdId}/tracking/{trackingId}',
          ...findTrackingController
        },
        {
          method: 'POST',
          path: '/birds/{birdId}/tracking',
          ...createTrackingController
        },
        {
          method: 'GET',
          path: '/birds/{birdId}/trackings',
          ...findTrackingsController
        }
      ])
    }
  }
}

export { plants }
