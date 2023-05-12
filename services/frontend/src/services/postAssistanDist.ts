import { privateApi } from './axiosConfig'

interface PutDistParams {
  display_name: string
  description: string
}

export async function postAssistantDist(params: PutDistParams) {
  try {
    const { data } = await privateApi.post('/assistant_dists', {
      ...params,
    })
    return data
  } catch (e) {
    throw e
  }
}
