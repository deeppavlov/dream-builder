import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Router/AuthProvider'

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

    auth?.login(code)
  }, [])

  return <>Redirecting...</>
}
