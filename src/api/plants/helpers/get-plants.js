async function getPlants(db) {
  const cursor = db.collection('plants').find({}, { projection: { _id: 0 } })

  return await cursor.toArray()
}

export { getPlants }
