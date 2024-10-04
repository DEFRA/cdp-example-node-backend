import { config } from '~/src/config'

const environmentVariablesController = {
  handler: (request, h) => {
    const name = request.params.variableId
    let value = process.env[name]

    if (!value) {
      try {
        value = config.get(name)
      } catch {
        request.logger.info(`Config could not be found ${name}`)
      }
    }

    return h
      .response({
        value
      })
      .code(200)
  }
}

export { environmentVariablesController }
