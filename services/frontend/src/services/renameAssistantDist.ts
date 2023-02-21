import { privateApi } from './axiosConfig'
import { PostDistParams } from '../types/types'

export async function renameAssistantDist(
  distName: string,
  newInfo: PostDistParams
) {
  console.log(`distname = `, distName)
  try {
    const { data } = await privateApi.patch(`/assistant_dists/${distName}`, {
      ...newInfo,
    })
    return data
  } catch (e) {
    console.log(e)
  }
}
