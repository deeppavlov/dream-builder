import { BotInfoInterface } from 'types/types'
import { api } from 'api/axiosConfig'

export async function getPublicAssistants(): Promise<BotInfoInterface[]> {
  try {
    const { data } = await api.get('assistant_dists/public_templates')
    return data
  } catch (e) {
    throw e
  }
}
