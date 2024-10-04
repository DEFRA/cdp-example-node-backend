import { environmentVariablesController } from '~/src/api/variables/controller'

const environmentVariables = {
  plugin: {
    name: 'variables',
    register: async (server) => {
      server.route({
        method: 'GET',
        path: '/variables/{variableId}',
        ...environmentVariablesController
      })
    }
  }
}

export { environmentVariables }
