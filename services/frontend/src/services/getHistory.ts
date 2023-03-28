import { privateApi } from './axiosConfig'

export async function getHistory(id: number) {
  try {
    const { data } = await privateApi.get(`/dialog_sessions/${id}/history`)
    // console.log(`history = `, data)
    return data
  } catch (e) {
    console.log(e)
    throw e
  }
}
