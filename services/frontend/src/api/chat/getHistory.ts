import { privateApi } from 'api/axiosConfig'

export async function getHistory(id: number) {
  try {
    const { data } = await privateApi.get(`/dialog_sessions/${id}/history`)
    return data
  } catch (e) {
    throw e
  }
}
