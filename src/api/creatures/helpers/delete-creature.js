import { ObjectId } from 'mongodb'

async function deleteCreature(db, creatureId) {
  const result = await db
    .collection('creatures')
    .deleteOne(
      { creatureId: new ObjectId(creatureId) },
      { projection: { _id: 0 } }
    )

  return await db
    .collection('creatures')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export { deleteCreature }
