const healthController = {
  handler: (request, h) => {
    process.exit(1)
    return h.response({ message: 'success' }).code(200)
  }
}

export { healthController }
