import { IUserApiKey } from 'types/types'

export const clearTokens = (lsName: string) => localStorage.removeItem(lsName)

export const saveTokens = (lsName: string, newState: IUserApiKey[] | null) => {
  const isTokens = newState !== null && newState?.length > 0

  if (!isTokens) return clearTokens(lsName)
  localStorage.setItem(lsName, JSON.stringify(newState))
}

export const isKeyRequiredForModel = (
  apiKey: IUserApiKey,
  lmServiceName: string
) =>
  lmServiceName
    .toLowerCase()
    .includes(apiKey.api_service.display_name.toLowerCase())

export const hideKeyValue = (str: string) => {
  if (str.length <= 8) {
    return str
  }
  return `${str.slice(0, 8)}***${str.slice(-3)}`
}
