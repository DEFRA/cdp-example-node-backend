describe('#testEndpoints routes', () => {
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

  test('/api/ok responds ok to any verb', async () => {
    const response = await server.inject({ method: 'DELETE', url: '/api/ok' })

    expect(response.statusCode).toBe(200)
    expect(response.payload).toBe('ok')
  })

  test('/api/json returns static json', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/json' })

    expect(response.statusCode).toBe(200)
    expect(response.result).toMatchObject({ key: '123', number: 42 })
  })

  test('/api/json echoes json payload', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: '/api/json',
      payload: { a: 1 }
    })

    expect(response.statusCode).toBe(200)
    expect(response.result).toEqual({ a: 1 })
  })

  test('/api/long-path returns the requested path', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/long-path/this/can/be/long'
    })

    expect(response.result).toEqual({ requestedPath: 'this/can/be/long' })
  })

  test('/api/headers sets custom headers', async () => {
    const response = await server.inject({ method: 'GET', url: '/api/headers' })

    expect(response.headers['x-custom-header']).toBe('test123')
    expect(response.headers['x-some-value']).toBe('SomeValue')
  })

  test('/api/error/{code} responds with the code', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/error/418'
    })

    expect(response.statusCode).toBe(418)
  })

  test('/api/error/{code} rejects invalid codes', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/error/99'
    })

    expect(response.statusCode).toBe(400)
  })
})
