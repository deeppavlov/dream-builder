import { privateApi } from 'api/axiosConfig'

export async function deleteAssistant(dist_name: string) {
  try {
    const { data } = await privateApi.delete(`/assistant_dists/${dist_name}`)
    return data
  } catch (e) {
    throw e
  }
}
