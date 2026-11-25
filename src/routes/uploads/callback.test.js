describe('#callback route', () => {
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

  test.each(['/uploads/callback', '/callback'])(
    'Should accept a callback on %s',
    async (url) => {
      const response = await server.inject({
        method: 'POST',
        url,
        payload: { foo: 'bar' }
      })

      expect(response.statusCode).toBe(200)
    }
  )
})
