import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/axiosConfig'
import { getGoogleOAuthURL } from '../services/getGoogleOAuthUrl'
import {
  IBeforeLoginModal,
  ITokens,
  UserContext,
  UserInterface,
} from '../types/types'
import { trigger } from '../utils/events'

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

export const AuthContext = createContext<UserContext | null>(null)
export const useAuth = () => useContext(AuthContext)

export const saveBeforeLoginModal = (modal: IBeforeLoginModal) =>
  sessionStorage.setItem('db_before_login_modal', JSON.stringify(modal))

const getBeforeLoginModal = (): IBeforeLoginModal | null => {
  const modal = sessionStorage.getItem('db_before_login_modal')
  return modal ? JSON.parse(modal) : null
}

const clearBeforeLoginModal = () =>
  sessionStorage.removeItem('db_before_login_modal')

const getLocalStorageUser = (): (UserInterface & ITokens) | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

const setLocalStorageUser = (user: UserInterface & ITokens) => {
  localStorage.setItem('user', JSON.stringify(user))
}

const getClearUrl = (url: string) => {
  var urlOject = new URL(url)
  urlOject.hash = ''
  urlOject.search = ''
  return urlOject.toString()
}

const savePreviousLocation = () =>
  sessionStorage.setItem('db_redirect_to', location.href)

const getPreviousLocation = () => sessionStorage.getItem('db_redirect_to')

const clearPreviousLocation = () => sessionStorage.removeItem('db_redirect_to')

export const exchangeAuthCode = async (code: string) => {
  let axiosConfig = {
    mode: 'no-cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }

  await authApi
    .post(`exchange_authcode?auth_code=${code}`, axiosConfig)
    .then(({ data }) => {
      setLocalStorageUser(data)
    })
    .catch(e => {
      console.log('ExchangeAuthCode failed!')
    })

  const beforeLoginUrl = getPreviousLocation() ?? getClearUrl(location.origin)
  location.href = beforeLoginUrl
}

export const login = () => {
  savePreviousLocation()
  location.href = getGoogleOAuthURL()
}

export const logout = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) console.log('Refresh token not exist for Logout!')

  let axiosConfig = {
    mode: 'no-cors',
    headers: { ['refresh-token']: refreshToken },
  }

  try {
    await authApi.put(`logout`, {}, axiosConfig)
  } catch (error) {
    console.log('Logout failed!', error)
  }

  deleteLocalStorageUser()
  location.reload()
}

export const AuthProvider = ({ children }: { children?: JSX.Element }) => {
  const [user, setUser] = useState<UserInterface | null>(null)

  useEffect(() => {
    const localStorageUser = getLocalStorageUser()

    if (user === null && localStorageUser !== null) {
      setUser(localStorageUser)
    }
  }, [])

  // Trigger requested before login Modal window,
  // and clear sessionStorage states
  useEffect(() => {
    const beforeLoginUrl = getPreviousLocation()

    if (!beforeLoginUrl || user === null) return

    const beforeLoginModal = getBeforeLoginModal()

    if (beforeLoginModal && location.href === beforeLoginUrl)
      trigger(beforeLoginModal.name, beforeLoginModal.options)

    clearPreviousLocation()
    clearBeforeLoginModal()
  }, [user])

  const userContextValue = useMemo(
    () => ({
      user,
    }),
    [user]
  )

  return (
    <AuthContext.Provider value={userContextValue}>
      {children}
    </AuthContext.Provider>
  )
}
