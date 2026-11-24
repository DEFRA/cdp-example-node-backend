import { health } from './health.js'

describe('#health', () => {
  const mockViewHandler = {
    response: vi.fn().mockReturnThis()
  }

  test('Should provide expected response', () => {
    health.handler(null, mockViewHandler)

    expect(mockViewHandler.response).toHaveBeenCalledWith({
      message: 'success'
    })
  })
})
