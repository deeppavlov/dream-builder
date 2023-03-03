import { rest } from 'msw'
import privateAssistantDists from './privateAssistantDists'
import { generateRoutingName } from '../utils/generateRoutingName'

interface paramsForDist {
  display_name: string
  description: string
}

const makeDistFromTemplate = (params: paramsForDist) => {
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
    return res(ctx.status(200), ctx.json(privateAssistantDists))
  }),

  rest.post('/assistant_dists/private', (req, res, ctx) => {
    const params = req?.body?.params!
    const response = makeDistFromTemplate(params)
    privateAssistantDists.push(response)
    return res(
      ctx.json({
        ...response,
      })
    )
  }),
  rest.post('/assistant_dists/:dist_name/publish', (req, res, ctx) => {
    return res(ctx.status(200, 'OK'))
  }),
  rest.delete('/assistant_dists/:dist_name', (req, res, ctx) => {
    const name = req.params.dist_name
    const index = privateAssistantDists.map(dist => dist.name).indexOf(name)
    const spliced = privateAssistantDists.splice(index, 1)
    return res(ctx.json(...spliced))
  }),
  rest.patch('/assistant_dists/:dist_name', (req, res, ctx) => {
    const name = req.params.dist_name
    const params = req.body
    const index = privateAssistantDists.map(dist => dist.name).indexOf(name)
    privateAssistantDists[index].display_name = params?.display_name
    privateAssistantDists[index].description = params?.description
    privateAssistantDists[index].name = generateRoutingName(params.display_name)
    return res(ctx.status(200, 'OK'))
  }),
]
