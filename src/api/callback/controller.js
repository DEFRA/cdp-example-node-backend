const callbackController = {
  handler: async (request, h) => {
    request.logger.info(request.payload, `Callback received`)
    return h.response().code(200)
  }
}

export { callbackController }
