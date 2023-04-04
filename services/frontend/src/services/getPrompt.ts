import { privateApi } from './axiosConfig'

export async function getPrompt(dist: string) {
  try {
    const { data } = await privateApi.get(`assistant_dists/${dist}/prompt`)
    return data
  } catch (e) {
    throw e
  }
}
