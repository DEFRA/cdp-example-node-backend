const healthController = {
  handler: (request, h) => h.response({ message: 'success' }).code(500)
}

export { healthController }
