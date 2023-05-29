import { privateApi } from 'api/axiosConfig'

export async function publishAssistant(dist_name: string, visibility: string) {
  try {
    const { data } = await privateApi.post(
      `/assistant_dists/${dist_name}/publish`,
      { visibility: visibility }
    )
    return data
  } catch (e) {
    throw e
  }
}
