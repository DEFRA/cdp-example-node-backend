export const okController = {
  handler: (request, h) => {
    return h.response('ok').code(200)
  }
}
