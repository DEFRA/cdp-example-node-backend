import { updateTrackingStatus } from '~/src/api/birds/helpers/update-tracking'

async function simulateProcessing(request, tracking) {
  if (!tracking.trackingStatus) {
    request.logger.warn({ tracking }, 'No status')
    return
  }

  if (
    tracking.trackingStatus === 'Ready' ||
    tracking.trackingStatus === 'Rejected'
  ) {
    request.logger.warn({ tracking }, 'Simulated processing already complete')
    return
  }

  if (tracking.trackingStatus === 'ReadyForProcessing') {
    request.logger.debug({ tracking }, 'Simulating processing')
    await setTrackingProcessing(request.db, tracking.trackingId)
    return
  }

  if (tracking.trackingStatus !== 'Processing') {
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
  await updateTrackingStatus(db, trackingId, 'Ready')
}

async function setTrackingProcessing(db, trackingId) {
  await updateTrackingStatus(db, trackingId, 'Processing')
}

async function setTrackingRejected(db, trackingId) {
  await updateTrackingStatus(db, trackingId, 'Rejected')
}

export { simulateProcessing }
