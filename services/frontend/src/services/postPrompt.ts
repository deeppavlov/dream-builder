import { privateApi } from './axiosConfig'

export async function postPrompt(dist: string, message: string) {
  console.log(console.log(`dist, message = `, dist, message))
  try {
    const { data } = await privateApi.post(`assistant_dists/${dist}/prompt`, {
      text: message,
    })

    return data
  } catch (e) {
    console.log(e)
    throw e
  }
}
