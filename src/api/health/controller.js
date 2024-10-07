const healthController = {
  handler: (request, h) => h.response({ message: 'success' }).code(400)
}

export { healthController }
