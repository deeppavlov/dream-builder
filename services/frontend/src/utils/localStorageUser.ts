import store from 'store2'
import { ITokens, UserInterface } from 'types/types'
import { I18N_STORE_KEY } from 'constants/constants'

export const getLocalStorageUser = (): (UserInterface & ITokens) | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const setLocalStorageUser = (user: UserInterface & ITokens) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const deleteLocalStorageUser = () => localStorage.removeItem('user')

export const getRefreshToken = (): string | null => {
  return getLocalStorageUser()?.refresh_token ?? null
}
export const getAccessToken = (): string | null => {
  return getLocalStorageUser()?.token ?? null
}

export const setAccessToken = (token: string) => {
  const user = getLocalStorageUser()
  if (!user) return

  setLocalStorageUser({ ...user, ...{ token } })
}

export const getLocale = (): string | null => store(I18N_STORE_KEY)
