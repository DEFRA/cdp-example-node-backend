import * as crypto from 'node:crypto'
import { ObjectId } from 'mongodb'

async function createTracking(db, birdId, spotter) {
  const trackingId = crypto.randomUUID()
  const result = await db.collection('bird-trackings').insertOne({
    referenceId: new ObjectId(),
    spotter,
    birdId,
    trackingId,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return await db
    .collection('bird-trackings')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export { createTracking }
