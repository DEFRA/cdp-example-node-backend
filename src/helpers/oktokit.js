import { Octokit } from '@octokit/core'
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods'
import { createPullRequest } from 'octokit-plugin-create-pull-request'
import { proxyFetch } from '~/src/helpers/proxy-fetch'

const OctokitExtra = Octokit.plugin(restEndpointMethods, createPullRequest)

const init = () => {
  const cfg = {
    request: { fetch: proxyFetch }
  }

  return new OctokitExtra(cfg)
}

const octokit = init()

export { octokit }
