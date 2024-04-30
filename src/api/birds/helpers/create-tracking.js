import { ObjectId } from 'mongodb'

async function createTracking(db, birdId, spotter) {
  const result = await db.collection('bird-trackings').insertOne({
    spotter,
    birdId,
    trackingId: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return await db
    .collection('bird-trackings')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export { createTracking }
