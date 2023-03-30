import { privateApi } from './axiosConfig'

export async function postPrompt(dist: string, message: string) {
  try {
    const { data } = await privateApi.post(`assistant_dists/${dist}/prompt`, {
      text: message,
    })

    return data
  } catch (e) {
    throw e
  }
}
