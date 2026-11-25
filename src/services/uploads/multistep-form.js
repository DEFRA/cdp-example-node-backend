import { ObjectId } from 'mongodb'

export async function createAnimal(db, animal) {
  const result = await db.collection('animals').insertOne({
    ...animal,
    animalId: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return db
    .collection('animals')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export async function getAnimal(db, animalId) {
  return db
    .collection('animals')
    .findOne({ animalId: new ObjectId(animalId) }, { projection: { _id: 0 } })
}

export async function getAnimals(db) {
  const cursor = db.collection('animals').find({}, { projection: { _id: 0 } })

  return cursor.toArray()
}
