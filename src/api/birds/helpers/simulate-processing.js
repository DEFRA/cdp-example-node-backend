import { updateTrackingStatus } from '~/src/api/birds/helpers/update-tracking'

async function simulateProcessing(request, tracking) {
  if (!tracking.trackingStatus) {
    console.log({ tracking }, 'No status' + tracking.trackingStatus)
    return
  }

  if (
    tracking.trackingStatus === 'Ready' ||
    tracking.trackingStatus === 'Rejected'
  ) {
    console.log({ tracking }, 'Simulated processing already complete')
    return
  }

  if (tracking.trackingStatus === 'ReadyForProcessing') {
    console.log({ tracking }, 'Simulating processing')
    await setTrackingProcessing(request.db, tracking.trackingId)
    return
  }

  if (tracking.trackingStatus !== 'Processing') {
    console.log({ tracking }, `Unknown status: ${tracking.trackingStatus}`)
    return
  }

  const dice = Math.ceil(Math.random() * 10)
  if (dice <= 6) {
    console.log({ tracking }, `Simulated processing continues`)
  } else if (dice > 9) {
    console.log({ tracking }, `Simulated processing failed:`)
    setTrackingRejected(request.db, tracking.trackingId)
  } else if (dice > 6) {
    console.log({ tracking }, `Simulated processing complete`)
    setTrackingReady(request.db, tracking.trackingId)
  } else {
    console.log({ tracking }, `Unknown dice roll ${dice}`)
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
