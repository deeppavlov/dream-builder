import { rest } from 'msw'
import privateAssistantDists from './privateAssistantDists'

const createDistFromTemplate = dist => {
  const dist_name = dist.dist_name
  const dist_description = dist.dist_description
  return {
    display_name: dist_name,
    author: 'DeepPavlov',
    description: dist_description,
    version: '0.1.0',
    date_created: Date.now(),
    ram_usage: '50 GB',
    gpu_usage: '50 GB',
    disk_usage: '50 GB',
    name: 'dream_sfc',
  }
}

export const handlers = [
  rest.get('/assistant_dists/private', (req, res, ctx) => {
    const token = req.cookies.jwt_token
    return token
      ? res(ctx.status(200), ctx.json(privateAssistantDists))
      : res(ctx.status(400), ctx.json('your token is not valid'))
  }),

  rest.put('/assistant_dists', (req, res, ctx) => {
    const dist = req.body.params
    privateAssistantDists.push(createDistFromTemplate(dist))
    return res(
      ctx.json({
        privateAssistantDists,
      })
    )
  }),
]
