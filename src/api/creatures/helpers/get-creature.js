import { UUID } from 'mongodb'

async function getCreature(db, creatureId) {
  return await db
    .collection('creatures')
    .findOne({ creatureId: new UUID(creatureId) }, { projection: { _id: 0 } })
}

export { getCreature }
