import { privateApi } from './axiosConfig'

export async function getTokens() {
  try {
    const { data } = await privateApi.get('api_tokens')
    return data
  } catch (e) {
    console.log(e)
  }
}
