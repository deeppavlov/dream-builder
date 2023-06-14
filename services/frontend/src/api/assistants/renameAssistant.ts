import { PostDistParams } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export async function renameAssistant(
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
  }
}
