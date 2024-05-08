async function findTrackings(db, birdId) {
  const cursor = db
    .collection('birdtrackings')
    .find({ birdId }, { projection: { _id: 0 } })

  return await cursor.toArray()
}

export { findTrackings }
