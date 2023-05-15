import { privateApi } from './axiosConfig'

export async function getHistory(id: number) {
  console.log('id = ', id)
  try {
    const { data } = await privateApi.get(`/dialog_sessions/${id}/history`)
    return data
  } catch (e) {
    throw e
  }
}
