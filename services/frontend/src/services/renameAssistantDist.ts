import { privateApi } from './axiosConfig'
import { PostDistParams } from '../types/types'

export async function renameAssistantDist(
  distName: string,
  newInfo: PostDistParams
) {
  try {
    const { data } = await privateApi.patch(`/assistant_dists/${distName}`, {
      ...newInfo,
    })
    return data
  } catch (e) {
    throw e
    console.log(e)
  }
}
