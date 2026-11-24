describe('#animals routes', () => {
  let server

  beforeAll(async () => {
    // Dynamic import needed due to config being updated by vitest-mongodb
    const { createServer } = await import('#/server.js')

    server = await createServer()
    await server.initialize()
    vi.spyOn(server.metrics, 'counter').mockResolvedValue()
  })

  afterAll(async () => {
    await server.stop({ timeout: 1000 })
  })

  test('Should create, get and list animals', async () => {
    const created = await server.inject({
      method: 'POST',
      url: '/animals',
      payload: { name: 'Rex', kind: 'dog', phoneNumber: '0123' }
    })

    expect(created.statusCode).toBe(200)
    const { animal } = created.result
    expect(animal).toMatchObject({ name: 'Rex', kind: 'dog' })
    expect(server.metrics.counter).toHaveBeenCalledWith('animals-created')

    const found = await server.inject({
      method: 'GET',
      url: `/animals/${animal.animalId}`
    })
    expect(found.statusCode).toBe(200)
    expect(found.result.animal).toMatchObject({ name: 'Rex' })

    const list = await server.inject({ method: 'GET', url: '/animals' })
    expect(list.statusCode).toBe(200)
    expect(list.result.message).toBe('success')
    expect(list.result.animals.length).toBeGreaterThan(0)
    expect(server.metrics.counter).toHaveBeenCalledWith('animals-list')
  })

  test('Should return 404 for unknown animal', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/animals/aaaaaaaaaaaaaaaaaaaaaaaa'
    })

    expect(response.statusCode).toBe(404)
  })

  test('Should reject invalid payload', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/animals',
      payload: { name: 'Rex' }
    })

    expect(response.statusCode).toBe(400)
  })
})
