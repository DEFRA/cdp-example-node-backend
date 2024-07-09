import { MongoClient } from 'mongodb'
import { config } from '~/src/config'

async function createAnimalsIndexes(db) {
  await db.collection('animals').createIndex({ animalId: 1 })
}
async function createPlantIndexes(db) {
  await db.collection('plants').createIndex({ plantId: 1 })
}
async function createCreaturesIndexes(db) {
  await db.collection('creatures').createIndex({ creatureId: 1 })
}
async function createBirdTrackingIndexes(db) {
  await db.collection('birdtrackings').createIndex({ trackingId: 1 })
}

const mongoDb = {
  plugin: {
    name: 'mongodb',
    version: '1.0.0',
    register: async function (server, options) {
      server.logger.info('Setting up mongodb')

      const client = await MongoClient.connect(options.mongoUrl, {
        retryWrites: options.retryWrites,
        readPreference: options.readPreference,
        ...(server.secureContext && { secureContext: server.secureContext })
      })
      const databaseName = options.databaseName
      const db = client.db(databaseName)

      await createAnimalsIndexes(db)
      await createPlantIndexes(db)
      await createCreaturesIndexes(db)
      await createBirdTrackingIndexes(db)

      server.logger.info(`mongodb connected to ${databaseName}`)

      server.decorate('server', 'mongoClient', client)
      server.decorate('server', 'db', db)
      server.decorate('request', 'db', db)

      server.events.on('stop', async () => {
        server.logger.info(`Closing Mongo client`)
        await client.close(true)
      })
    }
  },
  options: {
    mongoUrl: config.get('mongoUri'),
    databaseName: config.get('mongoDatabase'),
    retryWrites: false,
    readPreference: 'secondary'
  }
}

export { mongoDb }
