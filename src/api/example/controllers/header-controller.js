export const headerController = {
  handler: (request, h) => {
    return h
      .response('ok')
      .code(200)
      .header('x-custom-header', 'test123')
      .header('X-SOME-VALUE', 'SomeValue')
  }
}
