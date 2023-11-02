import ga4 from 'react-ga4'
import { useLocation, useParams } from 'react-router-dom'
import store from 'store2'
import { usePreview } from 'context/PreviewProvider'
import {
  getBeforeLoginAnalyticsState,
  saveBeforeLoginAnalyticsState,
} from 'utils/beforeSignInManager'
import { getPageType, safeFunctionWrapper } from 'utils/googleAnalytics'
import { getAuthType } from 'utils/localStorageAuth'

export const useGaAuth = () => {
  const { isPreview } = usePreview()
  const { pathname } = useLocation()
  const { skillId } = useParams()
  const event_type = 'Authorization'

  const authClick = (authSource: string) => {
    const prevState = getBeforeLoginAnalyticsState()
    saveBeforeLoginAnalyticsState({
      ...prevState,
      authSource,
    })
  }

  const userLoggedIn = (source_type: string, firstAuth: boolean) => {
    const page_type = getPageType(pathname, isPreview, skillId)
    const eventName = firstAuth ? 'User_signed_up' : 'User_logged_in'
    const auth_type = getAuthType()

    ga4.event(eventName, {
      source_type,
      page_type,
      event_type,
      auth_type,
    })
  }

  const userLoggedOut = () => {
    const page_type = getPageType(pathname, isPreview, skillId)

    ga4.event('User_logged_out', {
      source_type: 'auth_button',
      page_type,
      event_type,
      auth_type: store.get('authType'),
    })
  }

  return {
    authClick,
    userLoggedIn: safeFunctionWrapper(userLoggedIn),
    userLoggedOut: safeFunctionWrapper(userLoggedOut),
  }
}
