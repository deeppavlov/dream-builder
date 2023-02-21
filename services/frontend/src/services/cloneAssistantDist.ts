import { privateApi } from './axiosConfig'
import { PostDistParams } from '../types/types'

export async function cloneAssistantDist(
  params: PostDistParams,
  dist_name: string
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
    console.log(e)
    throw e
  }
}
