import { privateApi } from './axiosConfig'

export async function getUserTokens(userId: string) {
  try {
    const { data } = await privateApi.get(
      `users/${userId}/settings/api_tokens/`
    )
    return data
  } catch (e) {
    throw e
  }
}
