import { api } from 'api/axiosConfig'

export async function getHistory(id: number) {
  try {
    const { data } = await api.get(`/dialog_sessions/${id}/history`)
    return data
  } catch (e) {
    throw e
  }
}
