import { privateApi } from './axiosConfig'

export async function deleteAssistantDist(dist_name: string) {
  try {
    const { data } = await privateApi.delete(`/assistant_dists/${dist_name}`)
    return data
  } catch (e) {
    throw e
  }
}
