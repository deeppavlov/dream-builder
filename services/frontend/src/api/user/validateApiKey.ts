import { LM_Service } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export const validateApiKey = async (
  api_key_value: string,
  lm_service: LM_Service
) => {
  try {
    const { data } = await privateApi.post('tokens/validate', {
      api_key_value,
      lm_service,
    })
    return data
  } catch (e) {
    throw e
  }
}
