import { privateApi } from './axiosConfig'

export async function deleteUserToken(
  user_id: string,
  user_api_token_id: string
) {
  try {
    const { data } = await privateApi.delete(
      `users/${user_id}/settings/api_tokens/${user_api_token_id}`
    )
    return data
  } catch (e) {
    throw e
  }
}
