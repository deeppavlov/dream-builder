import ga4 from 'react-ga4'
import { useParams } from 'react-router-dom'
import { usePreview } from 'context/PreviewProvider'

type PageType =
  | 'all_va_page'
  | 'allbots'
  | 'yourbots'
  | 'admin_panel'
  | 'va_skillset_page'
  | 'va_template_skillset_page'
  | 'va_skill_editor'
export const useGaDeepy = () => {
  const { skillId } = useParams()
  const { isPreview } = usePreview()

  const getPageType = (): PageType => {
    let pageType: PageType
    switch (location.pathname) {
      case '/':
        pageType = 'all_va_page'
        break
      case '/allbots':
        pageType = 'allbots'
        break
      case '/yourbots':
        pageType = 'yourbots'
        break
      case '/admin':
        pageType = 'admin_panel'
        break
      default:
        pageType = skillId
          ? 'va_skill_editor'
          : isPreview
          ? 'va_template_skillset_page'
          : 'va_skillset_page'
        break
    }
    return pageType
  }

  const deepyChatOpened = () => {
    ga4.event('Deepy_Chat_Opened', {
      source: 'va_templates_block',
      page_type: getPageType(),
      event_type: 'Deepy',
    })
  }

  const deepyChatSend = (chatHistoryLength: number) => {
    if (!chatHistoryLength) return

    const eventName =
      chatHistoryLength > 2 ? 'Deepy_Chat_Send' : 'Deepy_Chat_Start'

    ga4.event(eventName, {
      source: 'va_templates_block',
      page_type: getPageType(),
      event_type: 'Deepy',
    })
  }

  const deepyChatRefresh = () => {
    ga4.event('Deepy_Chat_Refresh', {
      source: 'va_templates_block',
      page_type: getPageType(),
      event_type: 'Deepy',
    })
  }

  return { deepyChatOpened, deepyChatSend, deepyChatRefresh }
}
