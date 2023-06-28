import { privateApi } from 'api/axiosConfig'

export async function cloneComponent(
  id: number,
  info: { display_name: string; description: string; prompt: string }
) {
  try {
    const { data } = await privateApi.post(`/components?clone_from_id=${id}`, {
      ...info,
    })
    return data
  } catch (e) {
    throw e
  }
}
