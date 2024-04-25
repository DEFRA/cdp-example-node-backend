async function getPlant(db, plantId) {
  return await db
    .collection('plants')
    .findOne({ plantId }, { projection: { _id: 0 } })
}

export { getPlant }
