import { MongoClient } from 'mongodb'

async function createAnimalsIndexes(db) {
  await db.collection('animals').createIndex({ animalId: 1 })
}
async function createPlantIndexes(db) {
  await db.collection('plants').createIndex({ plantId: 1 })
}
async function createCreaturesIndexes(db) {
  await db.collection('creatures').createIndex({ creatureId: 1 })
}

const mongoPlugin = {
  name: 'mongodb',
  version: '1.0.0',
  register: async function (server, options) {
    server.logger.info('Setting up mongodb')

    const client = await MongoClient.connect(options.mongoUrl, {
      retryWrites: options.retryWrites,
      readPreference: options.readPreference,
      secureContext: options.secureContext
    })
    const databaseName = options.databaseName
    const db = client.db(databaseName)

    await createAnimalsIndexes(db)
    await createPlantIndexes(db)
    await createCreaturesIndexes(db)

    server.logger.info(`mongodb connected to ${databaseName}`)

    server.decorate('server', 'mongoClient', client)
    server.decorate('server', 'db', db)
    server.decorate('request', 'db', db)
  }
}

export { mongoPlugin }
