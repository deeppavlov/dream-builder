import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeAuthCode } from 'api/user'
import { getAuthType } from 'utils/localStorageAuth'
import { setLocalStorageUser } from 'utils/localStorageUser'

export const AuthPage = () => {
  const nav = useNavigate()

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code')

    const authType = getAuthType()

    if (!code) {
      nav('/')
      return
    }

    exchangeAuthCode(code, authType).then(data => {
      setLocalStorageUser(data)
    })
  }, [])

  return <>Redirecting...</>
}
