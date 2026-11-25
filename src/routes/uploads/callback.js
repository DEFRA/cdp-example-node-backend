import { statusCodes } from '#/common/constants/status-codes.js'

export const callback = [
  {
    method: 'POST',
    path: '/uploads/callback',
    handler: async (request, h) => {
      request.logger.info(request.payload, `Callback received`)
      return h.response().code(statusCodes.ok)
    }
  }
]
