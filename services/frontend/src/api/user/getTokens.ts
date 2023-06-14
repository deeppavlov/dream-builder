import { privateApi } from 'api/axiosConfig'

export async function getTokens() {
  try {
    const { data } = await privateApi.get('api_keys')
    return data
  } catch (e) {
    throw e
  }
}
