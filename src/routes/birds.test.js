import { trackingStatus } from '#/services/birds.js'

describe('#birds routes', () => {
  let server

  beforeAll(async () => {
    // Dynamic import needed due to config being updated by vitest-mongodb
    const { createServer } = await import('#/server.js')

    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 1000 })
  })

  test('Should create a tracking and move it to processing after upload callback', async () => {
    const created = await server.inject({
      method: 'POST',
      url: '/birds/1/tracking',
      payload: { spotter: 'Ann' }
    })

    expect(created.statusCode).toBe(200)
    const { tracking } = created.result
    expect(tracking).toMatchObject({
      birdId: 1,
      spotter: 'Ann',
      trackingStatus: trackingStatus.uploadpending
    })
    const trackingId = tracking.trackingId.toHexString(true)

    const list = await server.inject({
      method: 'GET',
      url: '/birds/1/trackings'
    })
    expect(list.statusCode).toBe(200)
    expect(list.result.trackings.length).toBeGreaterThan(0)

    const callback = await server.inject({
      method: 'POST',
      url: `/birds/1/tracking/${trackingId}/callback`,
      payload: {
        uploadStatus: 'ready',
        destinationBucket: 'bucket',
        form: {
          file: {
            fileStatus: 'complete',
            s3Key: 'key',
            filename: 'bird.jpg',
            contentType: 'image/jpeg',
            contentLength: 1
          }
        }
      }
    })
    expect(callback.statusCode).toBe(204)

    const found = await server.inject({
      method: 'GET',
      url: `/birds/1/tracking/${trackingId}`
    })
    expect(found.statusCode).toBe(200)
    expect(found.result.tracking.tracking.trackingStatus).toBe(
      trackingStatus.processing
    )
  })

  test('Should return 404 for unknown tracking', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/birds/1/tracking/3a7e15b1-3fb7-4e53-8ece-8eb96c7b6f61'
    })

    expect(response.statusCode).toBe(404)
  })
})
