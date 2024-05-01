async function getCreatures(db) {
  const cursor = db.collection('creatures').find({}, { projection: { _id: 0 } })

  return await cursor.toArray()
}

export { getCreatures }
