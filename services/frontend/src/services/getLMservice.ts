import { privateApi } from './axiosConfig'

export async function getLMservice(dist: string) {
  try {
    const { data } = await privateApi.get(`assistant_dists/${dist}/lm_service`)
    return data
  } catch (e) {
    throw e
  }
}
