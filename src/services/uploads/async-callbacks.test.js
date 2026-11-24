import {
  simulateProcessing,
  trackingStatus,
  updateTrackingStatusUrl
} from './async-callbacks.js'

const trackingId = '3a7e15b1-3fb7-4e53-8ece-8eb96c7b6f61'

function mockDb(updateOne = vi.fn().mockResolvedValue({ modifiedCount: 1 })) {
  return { collection: vi.fn().mockReturnValue({ updateOne }) }
}

describe('#simulateProcessing', () => {
  test('Should return tracking if already ready', async () => {
    const request = {
      logger: {
        info: vi.fn()
      }
    }
    const tracking = {
      trackingStatus: trackingStatus.ready
    }

    const result = await simulateProcessing(request, tracking)

    expect(result).toBe(tracking)
    expect(request.logger.info).toHaveBeenCalledWith(
      { tracking },
      'Simulated processing already complete'
    )
  })

  test('Should return tracking if already rejected', async () => {
    const request = {
      logger: {
        info: vi.fn()
      }
    }
    const tracking = {
      trackingStatus: trackingStatus.rejected
    }

    const result = await simulateProcessing(request, tracking)

    expect(result).toBe(tracking)
    expect(request.logger.info).toHaveBeenCalledWith(
      { tracking },
      'Simulated processing already complete'
    )
  })

  test('Should log error and return tracking if no status', async () => {
    const request = {
      logger: {
        warn: vi.fn()
      }
    }
    const tracking = {
      trackingStatus: null
    }

    const result = await simulateProcessing(request, tracking)

    expect(result).toBe(tracking)
    expect(request.logger.warn).toHaveBeenCalledWith({ tracking }, 'No status')
  })

  test('Should log error and return tracking if unknown status', async () => {
    const request = {
      logger: {
        error: vi.fn()
      }
    }
    const tracking = {
      trackingStatus: 'something'
    }

    const result = await simulateProcessing(request, tracking)

    expect(result).toBe(tracking)
    expect(request.logger.error).toHaveBeenCalledWith(
      { tracking },
      'Unknown status: something'
    )
  })

  test('Should log error and return tracking if pending', async () => {
    const request = {
      logger: {
        debug: vi.fn()
      }
    }
    const tracking = {
      trackingStatus: trackingStatus.uploadpending
    }

    const result = await simulateProcessing(request, tracking)

    expect(result).toBe(tracking)
    expect(request.logger.debug).toHaveBeenCalledWith(
      { tracking },
      'Not yet finished uploading'
    )
  })

  describe('When processing', () => {
    const tracking = { trackingId, trackingStatus: trackingStatus.processing }

    function processingRequest(db = mockDb()) {
      return { db, logger: { debug: vi.fn(), info: vi.fn() } }
    }

    function updatedStatus(db) {
      return db.collection().updateOne.mock.calls[0]?.[1].$set.trackingStatus
    }

    afterEach(() => {
      vi.restoreAllMocks()
    })

    test.each([
      [0.1, undefined],
      [0.7, trackingStatus.ready],
      [0.95, trackingStatus.rejected]
    ])(
      'Should roll %s and update status to %s',
      async (roll, expectedStatus) => {
        vi.spyOn(Math, 'random').mockReturnValue(roll)
        const request = processingRequest()

        const result = await simulateProcessing(request, tracking)

        expect(result).toBe(tracking)
        expect(updatedStatus(request.db)).toBe(expectedStatus)
      }
    )

    test('Should propagate a failed status update', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.7)
      const error = new Error('db down')
      const request = processingRequest(
        mockDb(vi.fn().mockRejectedValue(error))
      )

      await expect(simulateProcessing(request, tracking)).rejects.toBe(error)
    })
  })
})

describe('#updateTrackingStatusUrl', () => {
  test('Should store updatedAt as a date', async () => {
    const db = mockDb()

    await updateTrackingStatusUrl(db, trackingId, 'http://status')

    const [, update] = db.collection().updateOne.mock.calls[0]
    expect(update.$set.statusUrl).toBe('http://status')
    expect(update.$set.updatedAt).toBeInstanceOf(Date)
  })
})
