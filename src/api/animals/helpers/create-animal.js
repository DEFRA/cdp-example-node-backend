import { ObjectId } from 'mongodb'

async function createAnimal(db, animal) {
  const result = await db.collection('animals').insertOne({
    ...animal,
    animalId: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return await db
    .collection('animals')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export { createAnimal }
