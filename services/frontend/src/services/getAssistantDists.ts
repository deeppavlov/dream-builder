import { api } from './axiosConfig'

export async function getAssistantDists() {
  const { data } = await api.get('assistant_dists')
  return data
}
