async function updateTrackingStatusUrl(db, trackingId, statusUrl) {
  return await db
    .collection('bird-trackings')
    .updateOne(
      { trackingId },
      { $set: { statusUrl, updatedAt: new Date().toISOString } }
    )
}

async function updateTrackingStatus(db, trackingId, trackingStatus) {
  return await db
    .collection('bird-trackings')
    .updateOne(
      { trackingId },
      { $set: { trackingStatus, updatedAt: new Date() } }
    )
}

async function updateTrackingFile(db, trackingId, fileDetails) {
  return await db
    .collection('bird-trackings')
    .updateOne({ trackingId }, { $set: { fileDetails, updatedAt: new Date() } })
}

export { updateTrackingFile, updateTrackingStatusUrl, updateTrackingStatus }
