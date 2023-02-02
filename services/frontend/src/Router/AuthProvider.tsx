import axios from 'axios'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext, UserInterface } from '../types/types'

export const deleteLocalStorageUser = () => localStorage.removeItem('user')

const getLocalStorageUser = (): (UserInterface & { token: string }) | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

const getToken = (): string | null => {
  return getLocalStorageUser()?.token ?? null
}

const setLocalStorageUser = (user: UserInterface & { token: string }) => {
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

    await axios
      .post(
        `${
          import.meta.env.VITE_AUTH_API_URL
        }/auth/exchange_authcode?auth_code=${code}`,
        axiosConfig
      )
      .then(({ data }) => {
        setLocalStorageUser(data)
        const clearUser = data
        delete clearUser.token

        setUser(clearUser)
      })
      .catch(e => {
        setUser(null)
        deleteLocalStorageUser()
        console.log(`ExchangeAuthCode failed:`, e)
      })

    // Remove extra query params and redirect
    // const urlObj = new URL(location.origin)
    // urlObj.search = ''
    // location.href = urlObj.origin
    nav('/')
  }

  const logout = async () => {
    const token = getToken()
    if (!token) console.log('Token not exist for Logout!')

    let axiosConfig = {
      mode: 'no-cors',
      headers: { token: token },
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_AUTH_API_URL}/auth/logout`,
        {},
        axiosConfig
      )
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
