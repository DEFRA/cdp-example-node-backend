import tls from 'node:tls'

import { getTrustStoreCerts } from '~/src/helpers/secure-context/get-trust-store-certs'

/**
 * Creates a new secure context loaded from Base64 encoded certs
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const secureContext = {
  plugin: {
    name: 'secure-context',
    register(server, options) {
      const trustStoreCerts = getTrustStoreCerts(process.env)
      server.logger.info(
        `Found ${trustStoreCerts.length} TRUSTSTORE_ certificates to install`
      )

      if (trustStoreCerts.length === 0) return

      const originalTlsCreateSecureContext = tls.createSecureContext
      const defaultCAs = tls.rootCertificates

      tls.createSecureContext = function (options = {}) {
        const mergedCa = [
          ...(Array.isArray(options.ca)
            ? options.ca
            : options.ca
              ? [options.ca]
              : []),
          ...defaultCAs,
          ...trustStoreCerts
        ]
        const newOptions = { ...options, ca: mergedCa }
        return originalTlsCreateSecureContext(newOptions)
      }
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
