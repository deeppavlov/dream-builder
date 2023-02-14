import { rest } from 'msw'
import privateAssistantDists from './privateAssistantDists'

const templateDist = {
  author: 'DeepPavlov',
  version: '0.1.0',
  date_created: Date.now(),
  ram_usage: '50 GB',
  gpu_usage: '50 GB',
  disk_usage: '50 GB',
  name: 'dream_sfc',
}

export const handlers = [
  rest.get('/assistant_dists/private', (req, res, ctx) => {
    const token = req.cookies.jwt_token
    return token
      ? res(ctx.status(200), ctx.json(privateAssistantDists))
      : res(ctx.status(400), ctx.json('your token is not valid'))
  }),

  rest.put('/assistant_dists', (req, res, ctx) => {
    privateAssistantDists.push({ ...templateDist, ...req.body.params })
    return res(
      ctx.json({
        ...templateDist,
        ...req.json(),
      })
    )
  }),
]
