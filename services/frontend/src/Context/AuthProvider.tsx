import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/axiosConfig'
import { ITokens, UserContext, UserInterface } from '../types/types'

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

const getLocalStorageUser = (): (UserInterface & ITokens) | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

const setLocalStorageUser = (user: UserInterface & ITokens) => {
  localStorage.setItem('user', JSON.stringify(user))
}

const getClearUrl = (url: string) => {
  var urlOject = new URL(location.origin)
  urlOject.hash = ''
  urlOject.search = ''
  return urlOject.toString()
}

export const AuthContext = createContext<UserContext | null>(null)
export const useAuth = () => useContext(AuthContext)

/**
 * Exchange Google `auth_code` for tokens
 */
export const login = async (code: string) => {
  localStorage.clear() // Clear all client states

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
      const clearUser = data
      delete clearUser.token
      delete clearUser.refresh_token
    })
    .catch(e => {
      // deleteLocalStorageUser()
      console.log(`ExchangeAuthCode failed:`, e)
    })

  location.href = getClearUrl(location.origin)
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

  // deleteLocalStorageUser()
  localStorage.clear() // Clear all client states
  location.href = getClearUrl(location.origin)
}

export const AuthProvider = ({ children }: { children?: JSX.Element }) => {
  const [user, setUser] = useState<UserInterface | null>(null)

  useEffect(() => {
    const user = getLocalStorageUser()

    if (!user) return
    setUser(user)
  }, [])

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
