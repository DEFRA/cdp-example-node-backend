async function getAnimals(db) {
  const cursor = db.collection('animals').find({}, { projection: { _id: 0 } })

  return await cursor.toArray()
}

export { getAnimals }
