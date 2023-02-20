import { rest } from 'msw'
import privateAssistantDists from './privateAssistantDists'
import { generateRoutingName } from '../utils/generateRoutingName'

const makeDistFromTemplate = params => {
  return {
    display_name: params.display_name,
    ...templateDist,
    name: generateRoutingName(params.display_name),
    description: params.description,
  }
}
const templateDist = {
  version: '0.1.0',
  date_created: Date.now(),
  ram_usage: '0 GB',
  gpu_usage: '0 GB',
  disk_usage: '0 GB',
}

export const handlers = [
  rest.get('/assistant_dists/private', (req, res, ctx) => {
    const token = req.cookies.jwt_token
    return token
      ? res(ctx.status(200), ctx.json(privateAssistantDists))
      : res(
          ctx.status(400),
          ctx.json({ detail: 'Access token has expired or token is bad' })
        )
  }),

  rest.put('/assistant_dists/private', (req, res, ctx) => {
    const params = req.body.params
    const response = makeDistFromTemplate(params)
    privateAssistantDists.push(response)
    return res(
      ctx.json({
        ...response,
      })
    )
  }),
]
