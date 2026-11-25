import { UUID } from 'mongodb'

export async function createCreature(db, creature) {
  const result = await db.collection('creatures').insertOne({
    ...creature,
    creatureId: new UUID(creature.creatureId),
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return db
    .collection('creatures')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export async function deleteCreature(db, creatureId) {
  return db
    .collection('creatures')
    .findOneAndDelete(
      { creatureId: new UUID(creatureId) },
      { projection: { _id: 0 } }
    )
}

export async function getCreature(db, creatureId) {
  return db
    .collection('creatures')
    .findOne({ creatureId: new UUID(creatureId) }, { projection: { _id: 0 } })
}

export async function getCreatures(db) {
  const cursor = db.collection('creatures').find({}, { projection: { _id: 0 } })

  return cursor.toArray()
}
