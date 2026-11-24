import { simulateProcessing, trackingStatus } from './birds.js'

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

    expect(result).toBeUndefined()
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
})
