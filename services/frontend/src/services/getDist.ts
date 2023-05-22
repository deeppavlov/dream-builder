import { privateApi } from './axiosConfig'

export async function getDist(dist_name: string) {
  try {
    const { data } = await privateApi.get(`assistant_dists/${dist_name}`)
    return data
  } catch (e) {
    throw e
  }
}
