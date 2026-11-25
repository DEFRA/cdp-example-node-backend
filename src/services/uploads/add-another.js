export async function createPlant(db, plant) {
  const result = await db.collection('plants').insertOne({
    ...plant,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return db
    .collection('plants')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export async function getPlant(db, plantId) {
  return db
    .collection('plants')
    .findOne({ plantId }, { projection: { _id: 0 } })
}

export async function getPlants(db) {
  const cursor = db.collection('plants').find({}, { projection: { _id: 0 } })

  return cursor.toArray()
}
