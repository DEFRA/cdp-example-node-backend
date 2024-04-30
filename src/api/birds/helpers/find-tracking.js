async function findTracking(db, birdId, trackingId) {
  return await db
    .collection('bird-trackings')
    .findOne({ birdId, trackingId }, { projection: { _id: 0 } })
}

export { findTracking }
