async function findTracking(db, trackingId) {
  return await db
    .collection('bird-trackings')
    .findOne(
      { trackingId: new ObjectId(trackingId) },
      { projection: { _id: 0 } }
    )
}

export { findTracking }
