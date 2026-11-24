export const callback = [
  {
    method: 'POST',
    path: '/uploads/callback',
    handler: async (request, h) => {
      request.logger.info(request.payload, `Callback received`)
      return h.response().code(200)
    }
  }
]
