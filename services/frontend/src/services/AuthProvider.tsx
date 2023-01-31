import axios from 'axios'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { UserContext, UserInterface } from '../types/types'

export const deleteLocalStorageUser = () => {
  localStorage.removeItem('user')
}

export const fetchUserLogout = async () => {
  let axiosConfig = {
    mode: 'no-cors',
    headers: {
      token: `${localStorage.getItem('token')}`,
    },
  }

  await axios
    .put('https://alpha.deepdream.builders:6999/auth/logout', axiosConfig)
    .catch(e => console.log(`Logout failed: ${e}`))
}

export const getLocalStorageUser = (): UserInterface | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const AuthContext = createContext<UserContext | null>(null)
export const useAuth = () => useContext(AuthContext)

const setLocalStorageUser = (user: UserInterface) => {
  localStorage.removeItem('user')
  localStorage.setItem('user', JSON.stringify(user))
}

export const AuthProvider = ({ children }: { children?: JSX.Element }) => {
  const [user, setUser] = useState<UserInterface | null>(null)

  const fetchUserLogin = async () => {
    let axiosConfig = {
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        token: `${localStorage.getItem('token')}`,
      },
    }

    await axios
      .get('https://alpha.deepdream.builders:6999/auth/login', axiosConfig)
      .then(({ data }) => {
        const user = {
          name: data.name,
          picture: data.picture,
          email: data.email,
        }

        setLocalStorageUser(user)
        // setUser(user)
        location.reload()
      })
      .catch(e => {
        setUser(null)
        deleteLocalStorageUser()
        localStorage.removeItem('token')
        console.log(`Authorization failed: ${e}`)
      })
  }

  useEffect(() => {
    const user = getLocalStorageUser()

    if (!user) return
    setUser(user)
  }, [])

  const login = (response: any) => {
    localStorage.removeItem('token')
    localStorage.setItem('token', `${response.credential}`)
    fetchUserLogin()
  }

  const logout = () => {
    fetchUserLogout()
    localStorage.removeItem('token')
    deleteLocalStorageUser()
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
