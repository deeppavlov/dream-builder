import { IPostUserToken } from '../types/types'
import { privateApi } from './axiosConfig'

export async function postUserTokens({
  user_id,
  api_token_id,
  token_value,
}: IPostUserToken) {
  try {
    const { data } = await privateApi.post(
      `users/${user_id}/settings/api_keys/`,
      { api_token_id, token_value }
    )
    return data
  } catch (e) {
    throw e
  }
}
