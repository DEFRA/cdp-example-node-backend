import Joi from 'joi'
import Boom from '@hapi/boom'

import {
  createTracking,
  fileStatus,
  findTracking,
  findTrackings,
  simulateProcessing,
  trackingStatus,
  updateTrackingFile,
  updateTrackingStatus,
  updateTrackingStatusUrl,
  uploadStatus
} from '#/services/birds.js'

const birdIdSchema = Joi.number().integer().positive().required()
const trackingIdSchema = Joi.string().uuid().required()

export const birds = [
  {
    method: 'POST',
    path: '/birds/{birdId}/tracking/{trackingId}/callback',
    options: {
      validate: {
        params: Joi.object({
          birdId: birdIdSchema,
          trackingId: trackingIdSchema
        })
      }
    },
    handler: async (request, h) => {
      const birdId = request.params.birdId
      const trackingId = request.params.trackingId

      const { tracking } = await findTracking(request.db, birdId, trackingId)

      if (tracking === null) {
        request.logger.warn(
          { birdId, trackingId },
          'Could not find tracking for callback'
        )
        return h
          .response({ message: 'Could not find tracking callback' })
          .code(404)
      }

      const payload = request.payload
      const file = payload?.form?.file

      request.logger.debug(
        { birdId, trackingId, tracking, payload, file },
        'Tracking callback'
      )

      const uploadedStatus = payload?.uploadStatus
      const s3Key = file?.s3Key
      const contentType = file?.contentType

      if (uploadedStatus !== uploadStatus.ready) {
        request.logger.warn({ trackingId }, `Unknown status: ${uploadedStatus}`)
        return h.response({ message: 'Unknown upload status' }).code(204)
      }

      if (file?.fileStatus === fileStatus.complete) {
        tracking.trackingStatus = trackingStatus.readyforprocessing
        const s3Bucket = payload?.destinationBucket
        const filename = file.filename
        const contentLength = file.contentLength
        tracking.fileDetails = {
          s3Key,
          s3Bucket,
          filename,
          contentType,
          contentLength
        }
        const updateFileResponse = await updateTrackingFile(
          request.db,
          trackingId,
          tracking.fileDetails
        )

        if (!updateFileResponse) {
          return h.response({ message: 'error' }).code(500)
        }
      } else {
        request.logger.warn(
          { trackingId, s3Key, tracking, file },
          'File was rejected by uploader'
        )
        tracking.trackingStatus = trackingStatus.rejected
      }

      const updateStatusResponse = await updateTrackingStatus(
        request.db,
        trackingId,
        tracking.trackingStatus
      )
      if (!updateStatusResponse) {
        return h.response({ message: 'error' }).code(500)
      }

      request.logger.info(
        { tracking, trackingId, birdId },
        'Tracking callback updated successfully'
      )

      return h.response().code(204)
    }
  },
  {
    method: 'POST',
    path: '/birds/{birdId}/tracking/{trackingId}/status-url',
    options: {
      validate: {
        params: Joi.object({
          birdId: birdIdSchema,
          trackingId: trackingIdSchema
        }),
        payload: Joi.object({
          statusUrl: Joi.string().required()
        })
      }
    },
    handler: async (request, h) => {
      const birdId = request.params.birdId
      const trackingId = request.params.trackingId
      const statusUrl = request.payload.statusUrl
      const tracking = await findTracking(request.db, birdId, trackingId)

      if (tracking === null) {
        return Boom.boomify(Boom.notFound())
      }

      await updateTrackingStatusUrl(request.db, trackingId, statusUrl)

      return h.response({ message: 'success', tracking }).code(200)
    }
  },
  {
    method: 'GET',
    path: '/birds/{birdId}/tracking/{trackingId}',
    options: {
      validate: {
        params: Joi.object({
          birdId: birdIdSchema,
          trackingId: trackingIdSchema
        })
      }
    },
    handler: async (request, h) => {
      const birdId = request.params.birdId
      const trackingId = request.params.trackingId

      let { tracking } = await findTracking(request.db, birdId, trackingId)

      if (tracking === null || !tracking?.trackingId) {
        request.logger.info(
          { birdId, trackingId, tracking },
          `Could not find tracking [${trackingId}]`
        )
        return h.response({ message: `Could not find tracking` }).code(404)
      }

      request.logger.debug(
        { birdId, trackingId, tracking },
        'Found tracking in get tracking'
      )

      await simulateProcessing(request, tracking)
      tracking = await findTracking(request.db, birdId, trackingId)

      return h.response({ tracking }).code(200)
    }
  },
  {
    method: 'POST',
    path: '/birds/{birdId}/tracking',
    options: {
      validate: {
        params: Joi.object({ birdId: birdIdSchema }),
        payload: Joi.object({
          spotter: Joi.string().required()
        })
      }
    },
    handler: async (request, h) => {
      const birdId = request.params.birdId
      const spotter = request.payload.spotter

      const tracking = await createTracking(request.db, birdId, spotter)
      request.logger.info(
        { birdId, tracking },
        'Created a tracking for birdId and spotter'
      )

      if (tracking === null) {
        return Boom.boomify(Boom.notFound())
      }

      return h.response({ tracking }).code(200)
    }
  },
  {
    method: 'GET',
    path: '/birds/{birdId}/trackings',
    options: {
      validate: {
        params: Joi.object({ birdId: birdIdSchema })
      }
    },
    handler: async (request, h) => {
      const birdId = request.params.birdId
      const trackings = await findTrackings(request.db, birdId)

      return h.response({ trackings }).code(200)
    }
  }
]
