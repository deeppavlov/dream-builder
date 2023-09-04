import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeAuthCode } from 'api/user'
import { setAuthType } from 'utils/localStorageAuth'

export const AuthPage = ({ authType }: { authType: 'google' | 'github' }) => {
  const nav = useNavigate()

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code')
    setAuthType(authType)

    if (!code) {
      nav('/')
      return
    }

    exchangeAuthCode(code, authType)
  }, [])

  return <>Redirecting...</>
}
