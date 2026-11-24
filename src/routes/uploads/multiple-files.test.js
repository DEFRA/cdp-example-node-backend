import { randomUUID } from 'node:crypto'

describe('#multipleFiles routes', () => {
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
      url: '/uploads/multiple-files/creatures',
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
      url: `/uploads/multiple-files/creatures/${creatureId}`
    })
    expect(found.statusCode).toBe(200)
    expect(found.result.creature).toMatchObject({ name: 'Nessie' })

    const list = await server.inject({
      method: 'GET',
      url: '/uploads/multiple-files/creatures'
    })
    expect(list.statusCode).toBe(200)
    expect(list.result.creatures.length).toBeGreaterThan(0)
  })

  test('Should return 404 for unknown creature', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/uploads/multiple-files/creatures/${randomUUID()}`
    })

    expect(response.statusCode).toBe(404)
  })

  test('Should delete a creature', async () => {
    const creatureId = randomUUID()
    await server.inject({
      method: 'POST',
      url: '/uploads/multiple-files/creatures',
      payload: {
        creatureId,
        name: 'Bigfoot',
        kind: 'ape',
        date: '2024-01-01',
        realLifeSighting: false
      }
    })
    const url = `/uploads/multiple-files/creatures/${creatureId}`

    const deleted = await server.inject({ method: 'DELETE', url })
    expect(deleted.statusCode).toBe(200)
    expect(deleted.result.creature).toMatchObject({ name: 'Bigfoot' })

    const found = await server.inject({ method: 'GET', url })
    expect(found.statusCode).toBe(404)

    const deletedAgain = await server.inject({ method: 'DELETE', url })
    expect(deletedAgain.statusCode).toBe(404)
  })

  test('Should reject delete with an invalid creature id', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/uploads/multiple-files/creatures/not-a-uuid'
    })

    expect(response.statusCode).toBe(400)
  })

  test.each(['/uploads/multiple-files/creatures', '/creatures'])(
    'Should list creatures on %s',
    async (url) => {
      const response = await server.inject({ method: 'GET', url })

      expect(response.statusCode).toBe(200)
      expect(response.result.message).toBe('success')
    }
  )
})
