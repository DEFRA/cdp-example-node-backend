import { UUID } from 'mongodb'
import { trackingStatus } from '~/src/api/birds/helpers/tracking-status'

async function createTracking(db, birdId, spotter) {
  const result = await db.collection('birdtrackings').insertOne({
    spotter,
    birdId,
    trackingId: new UUID(),
    trackingStatus: trackingStatus.uploadpending,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return await db
    .collection('birdtrackings')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export { createTracking }
