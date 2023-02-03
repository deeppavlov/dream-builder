import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

export const AuthContext = createContext<UserContext | null>(null)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children?: JSX.Element }) => {
  const [user, setUser] = useState<UserInterface | null>(null)
  const nav = useNavigate()

  /**
   * Exchange Google `auth_code` for tokens
   */
  const login = async (code: string) => {
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

        setUser(clearUser)
      })
      .catch(e => {
        setUser(null)
        deleteLocalStorageUser()
        console.log(`ExchangeAuthCode failed:`, e)
      })

    nav('/')
  }

  const logout = async () => {
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

  useEffect(() => {
    const user = getLocalStorageUser()

    if (!user) return
    setUser(user)
  }, [])

  const userContextValue = useMemo(
    () => ({
      user,
      // setUser,
      login,
      logout,
    }),
    [user]
  )

  return (
    <AuthContext.Provider value={userContextValue}>
      {children}
    </AuthContext.Provider>
  )
}
