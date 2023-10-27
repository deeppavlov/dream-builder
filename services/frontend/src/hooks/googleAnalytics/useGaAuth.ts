import ga4 from 'react-ga4'
import { useLocation, useParams } from 'react-router-dom'
import store from 'store2'
import { usePreview } from 'context/PreviewProvider'
import { getPageType, safeFunctionWrapper } from 'utils/googleAnalytics'

export const useGaAuth = () => {
  const { isPreview } = usePreview()
  const { pathname } = useLocation()
  const { skillId } = useParams()
  const event_type = 'Authorization'

  const userLoggedIn = (source_type: string, auth_type: string) => {
    const page_type = getPageType(pathname, isPreview, skillId)

    ga4.event('User_logged_in', {
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
    userLoggedIn: safeFunctionWrapper(userLoggedIn),
    userLoggedOut: safeFunctionWrapper(userLoggedOut),
  }
}
