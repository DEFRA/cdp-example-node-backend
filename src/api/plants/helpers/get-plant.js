import { ObjectId } from 'mongodb'

async function getPlant(db, plantId) {
  return await db
    .collection('plants')
    .findOne({ plantId: new ObjectId(plantId) }, { projection: { _id: 0 } })
}

export { getPlant }
