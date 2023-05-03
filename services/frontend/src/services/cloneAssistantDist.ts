import { PostDistParams } from '../types/types'
import { privateApi } from './axiosConfig'

export async function cloneAssistantDist(
  dist_name: string,
  params: PostDistParams
) {
  try {
    const { data } = await privateApi.post(
      `/assistant_dists/${dist_name}/clone`,
      {
        ...params,
      }
    )
    return data
  } catch (e) {
    throw e
  }
}
