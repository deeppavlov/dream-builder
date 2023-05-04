import { privateApi } from './axiosConfig'

export async function getPrivateDists() {
  try {
    const { data } = await privateApi.get('/assistant_dists/user_owned')
    return data
  } catch (e) {
    throw e
  }
}
