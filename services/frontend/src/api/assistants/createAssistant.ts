import { privateApi } from 'api/axiosConfig'

interface PutDistParams {
  display_name: string
  description: string
}

export async function createAssistant(params: PutDistParams) {
  try {
    const { data } = await privateApi.post('/assistant_dists', {
      ...params,
    })
    return data
  } catch (e) {
    throw e
  }
}
