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
  name: string,
  forDeepy: boolean = false
): string | null => {
  return (
    getLSApiKeys(userId)?.filter(
      ({ api_service, useForDeepy }: IUserApiKey) => {
        return forDeepy
          ? api_service.display_name === name && useForDeepy
          : api_service.display_name === name
      }
    )?.[0]?.token_value ?? null
  )
}

export const checkLMIsOpenAi = (name: string) =>
  new RegExp('\\b' + 'openai-api' + '\\b').test(name)
