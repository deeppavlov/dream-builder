import { useGAContext, useUIOptions } from 'context'
import ga4 from 'react-ga4'
import { useLocation, useParams } from 'react-router-dom'
import { BotInfoInterface, IPublicationRequest } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { VISIBILITY_STATUS } from 'constants/constants'
import { consts } from 'utils/consts'
import {
  getPageType,
  getView,
  safeFunctionWrapper,
} from 'utils/googleAnalytics'

export const useGaPublication = () => {
  const { skillId } = useParams()
  const { isPreview } = usePreview()
  const { pathname } = useLocation()
  const { UIOptions } = useUIOptions()
  const { gaState, setGaState } = useGAContext()
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]
  const event_type = 'Publication'

  const visibilityVaButtonClick = (
    source_type: 'va_block' | 'va_sidepanel' | 'va_control_block',
    assistant: BotInfoInterface | undefined
  ) => {
    const page_type = getPageType(pathname, isPreview, skillId)
    const is_published =
      assistant?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE

    setGaState({ ...gaState, source_type, assistant })

    ga4.event('Visibility_VA_Button_Click', {
      source_type,
      page_type,
      view: getView(page_type, isTableView),
      va_id: assistant?.id,
      va_name: assistant?.display_name,
      va_prev_status: assistant?.visibility,
      is_published,
      event_type,
    })
  }

  const vaVisibilityChanged = (newVisibility: string) => {
    const page_type = getPageType(pathname, isPreview, skillId)
    const { source_type, assistant } = gaState

    const eventName =
      newVisibility === 'PUBLIC_TEMPLATE'
        ? 'VA_Published'
        : newVisibility === 'UNLISTED_LINK'
        ? 'VA_Unlisted'
        : 'VA_Private'

    ga4.event(eventName, {
      source_type,
      page_type,
      view: getView(page_type, isTableView),
      va_id: assistant?.id,
      va_name: assistant?.display_name,
      va_prev_status: assistant?.visibility,
      event_type,
    })
  }

  const publicationRequestHandled = (
    publicationRequest: IPublicationRequest,
    type: 'accept' | 'decline'
  ) => {
    const { virtual_assistant: assistant } = publicationRequest
    const eventName =
      type === 'accept'
        ? 'Publication_Template_VA_Accepted'
        : 'Publication_Template_VA_Rejected'
    const source_type =
      type === 'accept' ? 'admin_accept_button' : 'admin_reject_button'

    ga4.event(eventName, {
      source_type,
      page_type: 'admin_panel',
      template_va_id: assistant?.id,
      template_va_name: assistant?.display_name,
      va_prev_status: assistant?.visibility,
      template_va_author_id: assistant?.author.id,
      template_va_author_name: assistant?.author.fullname,
      event_type,
    })
  }

  return {
    visibilityVaButtonClick: safeFunctionWrapper(visibilityVaButtonClick),
    vaVisibilityChanged: safeFunctionWrapper(vaVisibilityChanged),
    publicationRequestHandled: safeFunctionWrapper(publicationRequestHandled),
  }
}
