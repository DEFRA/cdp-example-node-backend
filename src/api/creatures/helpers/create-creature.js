import { UUID } from 'mongodb'

async function createCreature(db, creature) {
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

export { createCreature }
