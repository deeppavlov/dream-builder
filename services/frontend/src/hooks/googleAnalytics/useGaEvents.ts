import { useUIOptions } from 'context'
import ga4 from 'react-ga4'
import { useLocation, useParams } from 'react-router-dom'
import { BotInfoInterface } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { consts } from 'utils/consts'
import {
  getPageType,
  getView,
  safeFunctionWrapper,
} from 'utils/googleAnalytics'

export const useGaEvents = () => {
  const { skillId } = useParams()
  const { isPreview } = usePreview()
  const { pathname } = useLocation()
  const { UIOptions } = useUIOptions()

  const vaIntegrationsOpened = () => {
    !pathname.includes('integration') &&
      ga4.event('VA_Integrations_Opened', {
        source_type: 'va_left_panel',
        page_type: 'va_skillset_page',
        event_type: 'Integrations',
      })
  }

  const languageChanged = (new_language: 'ru' | 'en') => {
    const page_type = getPageType(pathname, isPreview, skillId)
    const old_language = new_language === 'ru' ? 'en' : 'ru'

    ga4.event('Language_Changed', {
      source_type: 'profile_settings',
      page_type,
      old_language,
      new_language,
      event_type: 'Language',
    })
  }

  const shareVaButtonClick = (
    source_type:
      | 'va_block'
      | 'va_sidepanel'
      | 'va_control_block'
      | 'va_action_menu',
    assistant?: BotInfoInterface
  ) => {
    const page_type = getPageType(pathname, isPreview, skillId)
    const isTableView = UIOptions[consts.IS_TABLE_VIEW]
    const view = getView(page_type, isTableView)

    ga4.event('Share_VA_Button_Click', {
      source_type,
      page_type,
      view,
      va_id: assistant?.id,
      va_name: assistant?.display_name,
      va_status: assistant?.visibility,
      va_language: assistant?.language?.value,
      event_type: 'Share',
    })
  }

  return {
    vaIntegrationsOpened: safeFunctionWrapper(vaIntegrationsOpened),
    languageChanged: safeFunctionWrapper(languageChanged),
    shareVaButtonClick: safeFunctionWrapper(shareVaButtonClick),
  }
}
