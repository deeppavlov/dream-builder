import { useAuth, useUIOptions } from 'context'
import ga4 from 'react-ga4'
import { useLocation, useParams } from 'react-router-dom'
import { BotInfoInterface } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { VISIBILITY_STATUS } from 'constants/constants'
import { consts } from 'utils/consts'
import {
  getPageType,
  getView,
  safeFunctionWrapper,
} from 'utils/googleAnalytics'

export const useGaChat = () => {
  const auth = useAuth()
  const isAuth = !!auth?.user
  const { skillId } = useParams()
  const { isPreview } = usePreview()
  const { pathname } = useLocation()
  const { UIOptions } = useUIOptions()
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]
  const event_type = 'Dialog panels'

  const chatOpened = (
    source: 'block' | 'sidepanel' | 'top_panel',
    assistant: BotInfoInterface
  ) => {
    if (!assistant.deployment) return

    const isPublicTemplate =
      assistant.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
    const source_type =
      source === 'top_panel'
        ? source
        : isPublicTemplate
        ? `va_template_${source}`
        : `va_${source}`
    const additional_services = !!assistant.required_api_keys?.length
    const page_type = getPageType(pathname, isPreview, skillId)
    const view = getView(page_type, isTableView)

    isPublicTemplate
      ? ga4.event('Template_VA_Chat_Opened', {
          source_type,
          page_type,
          view,
          auth_status: isAuth,
          template_va_id: assistant.id,
          template_va_name: assistant.display_name,
          template_va_author_id: assistant.author.id,
          template_va_author_name: assistant.author.name,
          template_va_language: assistant?.language?.value,
          additional_services,
          event_type,
        })
      : ga4.event('VA_Chat_Opened', {
          source_type,
          page_type,
          view,
          va_id: assistant.id,
          va_name: assistant.display_name,
          va_language: assistant?.language?.value,
          template_va_id: assistant.cloned_from_id,
          template_va_name: 'TODO',
          additional_services,
          event_type,
        })
  }

  const chatSend = (historyLength: number) => {
    const isAuth = !!auth?.user
    const assistant = UIOptions[consts.CHAT_SP_IS_ACTIVE]
    const isPublicTemplate =
      assistant.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
    const source_type = isPublicTemplate
      ? 'va_template_sidepanel'
      : 'va_sidepanel'
    const additional_services = !!assistant.required_api_keys?.length
    const page_type = getPageType(pathname, isPreview, skillId)
    const view = getView(page_type, isTableView)

    if (isPublicTemplate) {
      const eventName = !historyLength
        ? 'Template_VA_Chat_Start'
        : 'Template_VA_Chat_Send'
      ga4.event(eventName, {
        source_type,
        page_type,
        view,
        auth_status: isAuth,
        template_va_id: assistant.id,
        template_va_name: assistant.display_name,
        template_va_language: assistant?.language?.value,
        template_va_author_id: assistant.author.id,
        template_va_author_name: assistant.author.name,
        additional_services,
        event_type,
      })
    } else {
      const eventName = !historyLength ? 'VA_Chat_Start' : 'VA_Chat_Send'
      ga4.event(eventName, {
        source_type,
        page_type,
        view,
        va_id: assistant.id,
        va_name: assistant.display_name,
        va_language: assistant?.language?.value,
        template_va_id: assistant.cloned_from_id,
        template_va_name: 'TODO',
        additional_services,
        event_type,
      })
    }
  }

  const refreshChat = (assistant: BotInfoInterface | undefined) => {
    const page_type = getPageType(pathname, isPreview, skillId)
    const view = getView(page_type, isTableView)
    const isAuth = !!auth?.user
    const additional_services = !!assistant?.required_api_keys?.length
    const isPublicTemplate =
      assistant?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE

    isPublicTemplate
      ? ga4.event('Template_VA_Chat_Refresh', {
          source_type: 'va_template_sidepanel',
          page_type,
          view,
          auth_shatus: isAuth,
          template_va_id: assistant?.id,
          template_va_name: assistant?.display_name,
          template_va_language: assistant?.language?.value,
          template_va_author_id: assistant?.author.id,
          template_va_author_name: assistant?.author.name,
          additional_services,
          event_type,
        })
      : ga4.event('VA_Chat_Refresh', {
          source_type: 'va_sidepanel',
          page_type,
          view,
          va_id: assistant?.id,
          va_name: assistant?.display_name,
          va_language: assistant?.language?.value,
          template_va_id: assistant?.cloned_from_id,
          template_va_name: 'TODO',
          additional_services,
          event_type,
        })
  }

  return {
    chatOpened: safeFunctionWrapper(chatOpened),
    chatSend: safeFunctionWrapper(chatSend),
    refreshChat: safeFunctionWrapper(refreshChat),
  }
}
