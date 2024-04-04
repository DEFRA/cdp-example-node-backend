import { ObjectId } from 'mongodb'

async function getAnimal(db, animalId) {
  return await db
    .collection('animals')
    .findOne({ animalId: new ObjectId(animalId) }, { projection: { _id: 0 } })
}

export { getAnimal }
