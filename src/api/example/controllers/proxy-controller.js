import Wreck from '@hapi/wreck'

export const proxyController = {
  handler: async (request, h) => {
    const { res, payload } = await Wreck.get('https://www.gov.uk')
    const msg = `call to external URL via proxy: status: ${res.statusCode}, payloadSize: ${payload.toString().length}`
    request.logger.info(msg)
    return h.response(msg).code(200)
  }
}
