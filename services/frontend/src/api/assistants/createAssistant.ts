import { ELOCALES_KEY } from 'types/types'
import { privateApi } from 'api/axiosConfig'

interface CreateAssistantPayload {
  display_name: string
  description: string
  lang: ELOCALES_KEY
}

export async function createAssistant(payload: CreateAssistantPayload) {
  try {
    const { data } = await privateApi.post('/assistant_dists', {
      ...payload,
    })
    return data
  } catch (e) {
    throw e
  }
}
