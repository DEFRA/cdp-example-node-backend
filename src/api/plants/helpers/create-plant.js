async function createPlant(db, plant) {
  const result = await db.collection('plants').insertOne({
    ...plant,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return await db
    .collection('plants')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export { createPlant }
