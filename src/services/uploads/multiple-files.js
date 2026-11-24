import { ObjectId, UUID } from 'mongodb'

export async function createCreature(db, creature) {
  const result = await db.collection('creatures').insertOne({
    ...creature,
    creatureId: new UUID(creature.creatureId),
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return await db
    .collection('creatures')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export async function deleteCreature(db, creatureId) {
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

export async function getCreature(db, creatureId) {
  return await db
    .collection('creatures')
    .findOne({ creatureId: new UUID(creatureId) }, { projection: { _id: 0 } })
}

export async function getCreatures(db) {
  const cursor = db.collection('creatures').find({}, { projection: { _id: 0 } })

  return await cursor.toArray()
}
