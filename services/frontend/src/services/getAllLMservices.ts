import { api } from './axiosConfig'

export async function getAllLMservices() {
  try {
    const { data } = await api.get(`deployments/lm_services`)
    return data
  } catch (e) {
    throw e
  }
}
