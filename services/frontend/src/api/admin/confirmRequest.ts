import { privateApi } from 'api/axiosConfig'

export async function confirmRequest(publish_request_id: number) {
  try {
    const { data } = await privateApi.post(
      `/admin/publish_request/${publish_request_id}/confirm`
    )
    return data
  } catch (e) {
    throw e
  }
}
