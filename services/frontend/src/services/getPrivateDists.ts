import { privateApi } from './axiosConfig'

export async function getPrivateDists() {
  try {
    const { data } = await privateApi.get('/assistant_dists/private')
    return data
  } catch (e) {
    throw e
  }
}
