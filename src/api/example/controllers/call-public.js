import { proxyFetch } from '~/src/helpers/proxy-fetch'

export const callPublic = {
  handler: async (request, h) => {
    const res = await proxyFetch(
      'https://cdp-defra-id-stub.dev.cdp-int.defra.cloud/cdp-defra-id-stub/.well-known/openid-configuration'
    )
    return h.response('ok ' + res.status).code(200)
  }
}
