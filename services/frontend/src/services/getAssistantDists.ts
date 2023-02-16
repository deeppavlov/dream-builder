import { api } from './axiosConfig'

export async function getAssistantDists() {
  try {
    const { data } = await api.get('assistant_dists/public')
    return data
  } catch (e) {
    console.log(e)
  }
}
