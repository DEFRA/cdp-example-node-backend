import { randomUUID } from 'node:crypto'

describe('#plants routes', () => {
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

  test('Should create, get and list plants', async () => {
    const plantId = randomUUID()
    const created = await server.inject({
      method: 'POST',
      url: '/plants',
      payload: { plantId, name: 'Fern' }
    })

    expect(created.statusCode).toBe(200)
    expect(created.result.plant).toMatchObject({ plantId, name: 'Fern' })

    const found = await server.inject({
      method: 'GET',
      url: `/plants/${plantId}`
    })
    expect(found.statusCode).toBe(200)
    expect(found.result.plant).toMatchObject({ plantId, name: 'Fern' })

    const list = await server.inject({ method: 'GET', url: '/plants' })
    expect(list.statusCode).toBe(200)
    expect(list.result.plants.length).toBeGreaterThan(0)
  })

  test('Should return 404 for unknown plant', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/plants/${randomUUID()}`
    })

    expect(response.statusCode).toBe(404)
  })
})
