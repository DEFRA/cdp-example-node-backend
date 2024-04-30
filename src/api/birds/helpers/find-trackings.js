async function findTrackings(db, birdId) {
  const cursor = db
    .collection('bird-trackings')
    .find({ birdId }, { projection: { _id: 0 } })

  return await cursor.toArray()
}

export { findTrackings }
