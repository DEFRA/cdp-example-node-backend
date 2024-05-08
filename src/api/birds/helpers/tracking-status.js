const trackingStatus = {
  ready: 'ready',
  readyforprocessing: 'readyforprocessing',
  processing: 'processing',
  rejected: 'rejected',
  uploadpending: 'uploadpending'
}

const uploadStatus = {
  ready: 'ready',
  rejected: 'rejected'
}

const uploadStatuses = [uploadStatus.ready, uploadStatus.rejected]

const fileStatus = {
  complete: 'complete',
  rejected: 'rejected'
}

export { fileStatus, trackingStatus, uploadStatus, uploadStatuses }
