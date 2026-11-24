import Joi from 'joi'
import Boom from '@hapi/boom'

import { statusCodes } from '#/common/constants/status-codes.js'

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
} from '#/services/uploads/async-callbacks.js'

const birdIdSchema = Joi.number().integer().positive().required()
const trackingIdSchema = Joi.string().uuid().required()

export const asyncCallbacks = [
  {
    method: 'POST',
    path: '/uploads/async-callbacks/birds/{birdId}/tracking/{trackingId}/callback',
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
          .code(statusCodes.notFound)
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
        return h
          .response({ message: 'Unknown upload status' })
          .code(statusCodes.noContent)
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
          return h
            .response({ message: 'error' })
            .code(statusCodes.internalServerError)
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
        return h
          .response({ message: 'error' })
          .code(statusCodes.internalServerError)
      }

      request.logger.info(
        { tracking, trackingId, birdId },
        'Tracking callback updated successfully'
      )

      return h.response().code(statusCodes.noContent)
    }
  },
  {
    method: 'POST',
    path: '/uploads/async-callbacks/birds/{birdId}/tracking/{trackingId}/status-url',
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
      const { tracking } = await findTracking(request.db, birdId, trackingId)

      if (tracking === null) {
        return Boom.boomify(Boom.notFound())
      }

      await updateTrackingStatusUrl(request.db, trackingId, statusUrl)

      return h.response({ message: 'success', tracking })
    }
  },
  {
    method: 'GET',
    path: '/uploads/async-callbacks/birds/{birdId}/tracking/{trackingId}',
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

      if (tracking === null || !tracking?.trackingId) {
        request.logger.info(
          { birdId, trackingId, tracking },
          `Could not find tracking [${trackingId}]`
        )
        return h
          .response({ message: `Could not find tracking` })
          .code(statusCodes.notFound)
      }

      request.logger.debug(
        { birdId, trackingId, tracking },
        'Found tracking in get tracking'
      )

      await simulateProcessing(request, tracking)
      const updated = await findTracking(request.db, birdId, trackingId)

      // Wrapped twice ({ tracking: { tracking } }): the frontend reads it that way
      return h.response({ tracking: updated })
    }
  },
  {
    method: 'POST',
    path: '/uploads/async-callbacks/birds/{birdId}/tracking',
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

      return h.response({ tracking })
    }
  },
  {
    method: 'GET',
    path: '/uploads/async-callbacks/birds/{birdId}/trackings',
    options: {
      validate: {
        params: Joi.object({ birdId: birdIdSchema })
      }
    },
    handler: async (request, h) => {
      const birdId = request.params.birdId
      const trackings = await findTrackings(request.db, birdId)

      return h.response({ trackings })
    }
  }
]
