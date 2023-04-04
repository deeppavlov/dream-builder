import { api } from './axiosConfig'

export async function getPublicDists() {
  try {
    const { data } = await api.get('assistant_dists/public')
    return data
  } catch (e) {
    throw e
  }
}
