import jwtDecode from 'jwt-decode'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext, UserInterface } from '../types/types'

export const getCookie = (name: string): string | null => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1]

  return cookieValue ?? null
}

export const getUser = (): UserInterface | null => {
  const jwt = getCookie('jwt_token')
  if (!jwt) return null
  const userObject: UserInterface = jwtDecode(jwt)
  return userObject ?? null
}

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=${new Date().getTime()}`
}

export const AuthContext = createContext<UserContext | null>(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children?: JSX.Element }) => {
  const [user, setUser] = useState<UserInterface | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = getUser()
    if (storedUser) setUser(storedUser)
  }, [])

  const login = (response: any) => {
    const jwt = response.credential

    // Set cookie expire time for jwt token
    const dayInMilliseconds = 86400000
    var now = new Date()
    var time = now.getTime()
    var expireTime = time + dayInMilliseconds * 30
    now.setTime(expireTime)

    document.cookie = `jwt_token=${jwt};expires=${now.toUTCString()}`
    setUser(getUser())
  }

  const logout = () => {
    deleteCookie('jwt_token')
    window.location.reload()
  }

  const userContextValue = useMemo(
    () => ({
      user,
      setUser,
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
