import { rest } from 'msw'
import privateAssistantDists from './privateAssistantDists'

export const handlers = [
  rest.get('/assistant_dists/private', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(privateAssistantDists))
  }),
]
