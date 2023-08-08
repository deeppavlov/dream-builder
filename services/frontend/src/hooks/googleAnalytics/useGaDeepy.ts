import ga4 from 'react-ga4'
import { useLocation, useParams } from 'react-router-dom'
import { usePreview } from 'context/PreviewProvider'
import { getPageType } from 'utils/googleAnalytics'

export const useGaDeepy = () => {
  const { skillId } = useParams()
  const { isPreview } = usePreview()
  const { pathname } = useLocation()

  const deepyChatOpened = () => {
    ga4.event('Deepy_Chat_Opened', {
      source: 'va_templates_block',
      page_type: getPageType(pathname, isPreview, skillId),
      event_type: 'Deepy',
    })
  }

  const deepyChatSend = (chatHistoryLength: number) => {
    if (!chatHistoryLength) return

    const eventName =
      chatHistoryLength > 2 ? 'Deepy_Chat_Send' : 'Deepy_Chat_Start'

    ga4.event(eventName, {
      source: 'va_templates_block',
      page_type: getPageType(pathname, isPreview, skillId),
      event_type: 'Deepy',
    })
  }

  const deepyChatRefresh = () => {
    ga4.event('Deepy_Chat_Refresh', {
      source: 'va_templates_block',
      page_type: getPageType(pathname, isPreview, skillId),
      event_type: 'Deepy',
    })
  }

  return { deepyChatOpened, deepyChatSend, deepyChatRefresh }
}