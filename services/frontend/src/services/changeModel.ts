import { privateApi } from './axiosConfig'

export async function changeModel(model: number, message: string) {
  try {
    const { data } = await privateApi.post(`dialog_sessions/${id}/chat`, {
      text: message,
    })

    return data
  } catch (e) {
    console.log(e)
    throw e
  }
}
