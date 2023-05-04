import { privateApi } from './axiosConfig'

export async function getUserTokens(userId: string) {
  try {
    const { data } = await privateApi.get(
      `users/${userId}/settings/api_keys/`
    )
    return data
  } catch (e) {
    throw e
  }
}
