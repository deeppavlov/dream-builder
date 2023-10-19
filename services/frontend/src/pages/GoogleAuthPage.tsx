import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeAuthCode } from 'api/user'

/**
 * Parsing `auth_code` that comes from Google
 */
export const GoogleAuthPage = () => {
  const nav = useNavigate()

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code')

    if (!code) {
      nav('/')
      return
    }

    exchangeAuthCode(code)
  }, [])

  return <>Redirecting...</>
}
