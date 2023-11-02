import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeAuthCode } from 'api/user'
import { useGaAuth } from 'hooks/googleAnalytics/useGaAuth'
import { getBeforeLoginAnalyticsState } from 'utils/beforeSignInManager'
import { getAuthType } from 'utils/localStorageAuth'
import { setLocalStorageUser } from 'utils/localStorageUser'

export const AuthPage = () => {
  const nav = useNavigate()
  const { userLoggedIn } = useGaAuth()

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code')

    const authType = getAuthType()

    if (!code) {
      nav('/')
      return
    }

    exchangeAuthCode(code, authType).then(data => {
      // google analytics
      const analyticsState = getBeforeLoginAnalyticsState()
      const source_type = analyticsState?.authSource as string
      userLoggedIn(source_type, data.first_auth)

      setLocalStorageUser(data)
    })
  }, [])

  return <>Redirecting...</>
}
