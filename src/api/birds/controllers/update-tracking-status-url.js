import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'

import { updateTrackingStatusUrl } from '~/src/api/birds/helpers/update-tracking'

const updateTrackingStatusUrlController = {
  options: {
    validate: {
      params: Joi.object({
        birdId: Joi.number().integer().positive().required(),
        trackingId: Joi.string().uuid().required()
      }),
      payload: Joi.object({
        statusUrl: Joi.string().required()
      })
    }
  },
  handler: async (request, h) => {
    const birdId = request.params.birdId
    const trackingId = request.params.trackingId
    const statusUrl = request.payload.statusUrl
    const tracking = await findTracking(request.db, trackingId)

    if (isNull(tracking)) {
      return Boom.boomify(Boom.notFound())
    }

    await updateTrackingStatusUrl(request.db, trackingId, statusUrl)

    return h.response({ message: 'success', tracking }).code(200)
  }
}

export { updateTrackingStatusUrlController }
