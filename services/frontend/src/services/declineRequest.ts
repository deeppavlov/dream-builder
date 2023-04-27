import { privateApi } from './axiosConfig'

export async function declineRequest(publish_request_id: number) {
  try {
    const { data } = await privateApi.post(
      `/admin/publish_request/${publish_request_id}/decline`
    )
    return data
  } catch (e) {
    throw e
  }
}
