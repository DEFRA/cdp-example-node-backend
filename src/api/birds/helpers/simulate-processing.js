import { updateTrackingStatus } from '~/src/api/birds/helpers/update-tracking'

async function simulateProcessing(request, tracking) {
  if (tracking.status === 'ReadyForProcessing') {
    console.log({ tracking }, 'Simulating processing')
    await setTrackingProcessing(request.db, tracking)
  }
  const dice = Math.ceil(Math.random() * 10)
  if (dice > 3) {
    console.log({ tracking }, 'Simulated processing continues')
  } else if (dice > 6) {
    console.log({ tracking }, 'Simulated processing failed')
    setTimeout(() => {
      setTrackingRejected(request.db, tracking.trackingId)
      return
    }, 2000)
  } else {
    console.log({ tracking }, 'Simulated processing complete')
    setTimeout(() => {
      setTrackingReady(request.db, tracking.trackingId)
    }, 2000)
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
