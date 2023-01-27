import axios from 'axios'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UserContext, UserInterface } from '../types/types'

const getGoogleOAuthURL = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/auth'

  const options = {
    redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL as string,
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      // 'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  }

  const qs = new URLSearchParams(options)

  return `${rootUrl}?${qs.toString()}`
}

export const deleteLocalStorageUser = () => {
  localStorage.removeItem('user')
}

const setLocalStorageUser = (user: UserInterface) => {
  localStorage.removeItem('user')
  localStorage.setItem('user', JSON.stringify(user))
}

const getLocalStorageUser = (): UserInterface | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const AuthContext = createContext<UserContext | null>(null)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children?: JSX.Element }) => {
  const [user, setUser] = useState<UserInterface | null>(null)
  const location = useLocation()

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
        // location.reload()
      })
      .catch(e => {
        setUser(null)
        deleteLocalStorageUser()
        localStorage.removeItem('token')
        console.log(`Authorization failed: ${e}`)
      })
  }

  const fetchUserLogout = async () => {
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

  useEffect(() => {
    const user = getLocalStorageUser()
    const code = new URLSearchParams(location.search).get('code')
    console.log(code)

    // axios.get(
    //   'http://localhost:6999/auth/exchange_authcode?auth_code=' + code,
    //   {
    //     mode: 'no-cors',
    //   }
    // ).then(res => console.log(res)).catch(e => console.log(e.response.data))

    if (!user) return
    setUser(user)
  }, [])

  const login = () => {
    localStorage.removeItem('token')
    // localStorage.setItem('token', `${response.credential}`)
    // fetchUserLogin()

    window.location.href = getGoogleOAuthURL()
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
