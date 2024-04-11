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

export const getLSApiKeyByDisplayName = (
  userId: number,
  displayName: string,
  forDeepy: boolean = false
): IUserApiKey | null => {
  return (
    getLSApiKeys(userId)?.find(({ api_service, useForDeepy }: IUserApiKey) => {
      return forDeepy
        ? api_service.display_name === displayName && useForDeepy
        : api_service.display_name === displayName
    }) ?? null
  )
}

export const checkLMIsOpenAi = (name: string) =>
  new RegExp('\\b' + 'openai-api' + '\\b').test(name)
