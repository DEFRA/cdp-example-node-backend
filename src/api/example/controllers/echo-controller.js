export const echoController = {
  handler: (request, h) => {
    request.logger.info('Headers: ' + JSON.stringify(request.headers, null, 2))
    request.logger.info('Body: ' + request.payload)
    return h.response(request.payload).code(200)
  }
}
