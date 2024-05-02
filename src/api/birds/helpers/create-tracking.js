import { ObjectId, UUID } from 'mongodb'

async function createTracking(db, birdId, spotter) {
  const result = await db.collection('bird-trackings').insertOne({
    referenceId: new ObjectId(),
    spotter,
    birdId,
    trackingId: UUID(),
    trackingStatus: 'UploadPending',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return await db
    .collection('bird-trackings')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export { createTracking }
