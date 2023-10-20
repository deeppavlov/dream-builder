import { useGAContext } from 'context'
import { useState } from 'react'
import ga4 from 'react-ga4'
import { useLocation, useParams } from 'react-router-dom'
import { usePreview } from 'context/PreviewProvider'
import { getPageType, safeFunctionWrapper } from 'utils/googleAnalytics'

export const useGaToken = () => {
  const { skillId } = useParams()
  const { isPreview } = usePreview()
  const { pathname } = useLocation()
  const { gaState, setGaState } = useGAContext()
  const event_type = 'AccessTokens'

  const setTokenState = (source_type: string, services?: string) => {
    setGaState({ ...gaState, source_type, services })
  }

  const openTokenModal = () => {
    const page_type = getPageType(pathname, isPreview, skillId)
    const { source_type, services } = gaState

    ga4.event('AccessTokens_Page_View', {
      source_type,
      page_type,
      services: services || 'None',
      event_type,
    })
  }

  const [length, setLength] = useState(1)
  const tokenPasted = (value?: string) => {
    const page_type = getPageType(pathname, isPreview, skillId)
    const { source_type, services } = gaState

    setLength(value?.length || 0)

    !length &&
      ga4.event('AccessTokens_Pasted', {
        source_type,
        page_type,
        services,
        event_type,
      })
  }

  const addOrDeleteToken = (
    services: string | undefined,
    action: 'add' | 'delete'
  ) => {
    const page_type = getPageType(pathname, isPreview, skillId)
    const { source_type } = gaState
    const eventName =
      action === 'add' ? 'AccessTokens_Added' : 'AccessTokens_Deleted'

    ga4.event(eventName, {
      source_type,
      page_type,
      services,
      event_type,
    })
  }

  const missingTokenError = (source_type: string, services?: string) => {
    const page_type = getPageType(pathname, isPreview, skillId)

    ga4.event('AccessTokens_Missing_Error_Detected', {
      source_type,
      page_type,
      services: services || 'None',
      event_type,
    })
  }

  return {
    openTokenModal: safeFunctionWrapper(openTokenModal),
    setTokenState: safeFunctionWrapper(setTokenState),
    tokenPasted: safeFunctionWrapper(tokenPasted),
    addOrDeleteToken: safeFunctionWrapper(addOrDeleteToken),
    missingTokenError: safeFunctionWrapper(missingTokenError),
  }
}
