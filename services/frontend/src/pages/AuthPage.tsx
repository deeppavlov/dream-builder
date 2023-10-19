import { useAuth } from 'context'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeAuthCode } from 'api/user'
import { getAuthType } from 'utils/localStorageAuth'

export const AuthPage = () => {
  const nav = useNavigate()
  const { setUser } = useAuth()

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code')

    const authType = getAuthType()

    if (!code) {
      nav('/')
      return
    }

    exchangeAuthCode(code, authType).then(data => {
      setUser(data)
    })
  }, [])

  return <>Redirecting...</>
}
