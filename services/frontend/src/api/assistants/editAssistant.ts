import { privateApi } from 'api/axiosConfig'

type NewAssistantInfo = { display_name: string; description: string }

export async function editAssistant(
  distName: string,
  newInfo: NewAssistantInfo
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
