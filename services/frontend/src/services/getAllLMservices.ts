import { LM_Service } from '../types/types'
import { api } from './axiosConfig'

export async function getAllLMservices(): Promise<LM_Service[]> {
  try {
    const { data } = await api.get(`lm_services`)
    return data
  } catch (e) {
    throw e
  }
}
