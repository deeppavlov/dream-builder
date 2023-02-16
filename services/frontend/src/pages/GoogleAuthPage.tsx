import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, useAuth } from '../Context/AuthProvider'

/**
 * Parsing `auth_code` that comes from Google
 */
export const GoogleAuthPage = () => {
  const auth = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code')

    if (!code) {
      nav('/')
      return
    }

    login(code)
  }, [])

  return <>Redirecting...</>
}
