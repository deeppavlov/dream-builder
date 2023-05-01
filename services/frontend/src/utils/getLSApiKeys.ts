import { IUserApiKey } from '../types/types'

/**
 * Get object name of user API keys by
 * @param userId
 */
export const getApiKeysLSId = (userId: number) => `user_${userId}_api_keys`

/**
 * Get user API keys from localStorage by
 * @param userId
 */
export const getLSApiKeys = (userId: number): IUserApiKey[] | null => {
  const localStorageTokens = localStorage.getItem(getApiKeysLSId(userId))
  return localStorageTokens ? JSON.parse(localStorageTokens) : null
}

export const getLSApiKeyByName = (
  userId: number,
  name: string
): string | null => {
  return (
    getLSApiKeys(userId)?.filter(
      ({ api_service }: IUserApiKey) => api_service.name === name
    )?.[0]?.token_value ?? null
  )
}
