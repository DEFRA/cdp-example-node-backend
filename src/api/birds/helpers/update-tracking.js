async function updateTrackingStatusUrl(db, trackingId, statusUrl) {
  return await db
    .collection('bird-trackings')
    .updateOne({ trackingId }, { $set: { statusUrl } })
}

export { updateTrackingStatusUrl }
