import { updateTrackingStatus } from '~/src/api/birds/helpers/update-tracking'
import { trackingStatus } from './tracking-status'

async function simulateProcessing(request, tracking) {
  if (!tracking.trackingStatus) {
    request.logger.warn({ tracking }, 'No status')
    return tracking
  }

  if (
    tracking.trackingStatus === trackingStatus.ready ||
    tracking.trackingStatus === trackingStatus.rejected
  ) {
    request.logger.warn({ tracking }, 'Simulated processing already complete')
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

export { simulateProcessing }
