import { UUID } from 'mongodb'

export const trackingStatus = {
  ready: 'ready',
  readyforprocessing: 'readyforprocessing',
  processing: 'processing',
  rejected: 'rejected',
  uploadpending: 'uploadpending'
}

export const uploadStatus = {
  ready: 'ready',
  rejected: 'rejected'
}

export const uploadStatuses = [uploadStatus.ready, uploadStatus.rejected]

export const fileStatus = {
  complete: 'complete',
  rejected: 'rejected'
}

export async function createTracking(db, birdId, spotter) {
  const result = await db.collection('birdtrackings').insertOne({
    spotter,
    birdId,
    trackingId: new UUID(),
    trackingStatus: trackingStatus.uploadpending,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return await db
    .collection('birdtrackings')
    .findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
}

export async function findTracking(db, birdId, trackingId) {
  const tracking = await db
    .collection('birdtrackings')
    .findOne(
      { birdId, trackingId: new UUID(trackingId) },
      { projection: { _id: 0 } }
    )
  return { tracking }
}

export async function findTrackings(db, birdId) {
  const cursor = db
    .collection('birdtrackings')
    .find({ birdId }, { projection: { _id: 0 } })

  return await cursor.toArray()
}

export async function updateTrackingStatusUrl(db, trackingId, statusUrl) {
  return await db
    .collection('birdtrackings')
    .updateOne(
      { trackingId: new UUID(trackingId) },
      { $set: { statusUrl, updatedAt: new Date().toISOString } }
    )
}

export async function updateTrackingStatus(db, trackingId, trackingStatus) {
  return await db
    .collection('birdtrackings')
    .updateOne(
      { trackingId: new UUID(trackingId) },
      { $set: { trackingStatus, updatedAt: new Date() } }
    )
}

export async function updateTrackingFile(db, trackingId, fileDetails) {
  return await db
    .collection('birdtrackings')
    .updateOne(
      { trackingId: new UUID(trackingId) },
      { $set: { fileDetails, updatedAt: new Date() } }
    )
}

export async function simulateProcessing(request, tracking) {
  if (!tracking.trackingStatus) {
    request.logger.warn({ tracking }, 'No status')
    return tracking
  }

  if (
    tracking.trackingStatus === trackingStatus.ready ||
    tracking.trackingStatus === trackingStatus.rejected
  ) {
    request.logger.info({ tracking }, 'Simulated processing already complete')
    return tracking
  }

  if (tracking.trackingStatus === trackingStatus.uploadpending) {
    request.logger.debug({ tracking }, 'Not yet finished uploading')
    return tracking
  }

  if (tracking.trackingStatus === trackingStatus.readyforprocessing) {
    request.logger.debug({ tracking }, 'Simulating processing')
    await setTrackingProcessing(request.db, tracking.trackingId)
    return tracking
  }

  if (tracking.trackingStatus !== trackingStatus.processing) {
    request.logger.error(
      { tracking },
      `Unknown status: ${tracking.trackingStatus}`
    )
    return
  }

  const dice = Math.ceil(Math.random() * 10)
  if (dice <= 6) {
    request.logger.debug({ tracking }, `Simulated processing continues`)
  } else if (dice > 9) {
    request.logger.info({ tracking }, `Simulated processing failed:`)
    setTrackingRejected(request.db, tracking.trackingId)
  } else if (dice > 6) {
    request.logger.info({ tracking }, `Simulated processing complete`)
    setTrackingReady(request.db, tracking.trackingId)
  } else {
    request.logger.error(`Unknown dice roll ${dice}`)
  }
}

async function setTrackingReady(db, trackingId) {
  await updateTrackingStatus(db, trackingId, trackingStatus.ready)
}

async function setTrackingProcessing(db, trackingId) {
  await updateTrackingStatus(db, trackingId, trackingStatus.processing)
}

async function setTrackingRejected(db, trackingId) {
  await updateTrackingStatus(db, trackingId, trackingStatus.rejected)
}
