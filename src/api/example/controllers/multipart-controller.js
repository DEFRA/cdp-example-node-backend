export const multipartController = {
  options: {
    payload: {
      allow: 'multipart/form-data',
      multipart: true,
      output: 'file',
      parse: false,
      timeout: false
    }
  },
  handler: (request, h) => {
    const keys = Object.keys(request.payload).join(', ')
    return h.response(`multipart accepted with keys ${keys}`).code(200)
  }
}
