import { ELOCALES_KEY, LM_Service } from 'types/types'
import { api } from 'api/axiosConfig'

export async function getAllLMservices(
  language?: ELOCALES_KEY | null
): Promise<LM_Service[]> {
  try {
    const { data } = language
      ? await api.get(`lm_services?language=${language}`)
      : await api.get('lm_services')
    return data
  } catch (e) {
    throw e
  }
}
