import { UUID } from 'mongodb'

async function findTracking(db, birdId, trackingId) {
  const tracking = await db
    .collection('birdtrackings')
    .findOne(
      { birdId, trackingId: new UUID(trackingId) },
      { projection: { _id: 0 } }
    )
  return { tracking }
}

export { findTracking }
