import { randomUUID } from 'node:crypto'

describe('#creatures routes', () => {
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

  test('Should create, get and list creatures', async () => {
    const creatureId = randomUUID()
    const created = await server.inject({
      method: 'POST',
      url: '/creatures',
      payload: {
        creatureId,
        name: 'Nessie',
        kind: 'monster',
        date: '2024-01-01',
        realLifeSighting: false
      }
    })

    expect(created.statusCode).toBe(200)
    expect(created.result.creature).toMatchObject({ name: 'Nessie' })

    const found = await server.inject({
      method: 'GET',
      url: `/creatures/${creatureId}`
    })
    expect(found.statusCode).toBe(200)
    expect(found.result.creature).toMatchObject({ name: 'Nessie' })

    const list = await server.inject({ method: 'GET', url: '/creatures' })
    expect(list.statusCode).toBe(200)
    expect(list.result.creatures.length).toBeGreaterThan(0)
  })

  test('Should return 404 for unknown creature', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/creatures/${randomUUID()}`
    })

    expect(response.statusCode).toBe(404)
  })
})
