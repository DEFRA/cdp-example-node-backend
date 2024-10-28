export const longPathController = {
  handler: (request, h) => {
    return h.response({ requestedPath: request.params.path }).code(200)
  }
}
