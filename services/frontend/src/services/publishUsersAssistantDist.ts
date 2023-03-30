import { BotVisabilityType } from '../types/types'
import { privateApi } from './axiosConfig'

export async function publishAssistantDist(
  dist_name: string,
  hide: boolean,
  visability: BotVisabilityType
) {
  try {
    const { data } = await privateApi.post(
      `/assistant_dists/${dist_name}/publish/`,
      { hide, visability }
    )
    return data
  } catch (e) {
    throw e
  }
}
