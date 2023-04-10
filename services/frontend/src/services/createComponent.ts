import { PostDistParams } from '../types/types'
import { privateApi } from './axiosConfig'

export async function createComponent(
  skillName: string,
  newInfo: PostDistParams
) {
  try {
    const { data } = await privateApi.patch(`/assistant_dists/`, {
      ...newInfo,
    })
    return data
  } catch (e) {
    throw e
  }
}
