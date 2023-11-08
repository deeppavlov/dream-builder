import { useAuth, useUIOptions } from 'context'
import { useGAContext } from 'context'
import ga4 from 'react-ga4'
import { useLocation } from 'react-router-dom'
import { BotInfoInterface } from 'types/types'
import { saveBeforeLoginAnalyticsState } from 'utils/beforeSignInManager'
import { consts } from 'utils/consts'
import { safeFunctionWrapper } from 'utils/googleAnalytics'

export const useGaAssistant = () => {
  const auth = useAuth()
  const isAuth = !!auth?.user
  const { pathname } = useLocation()
  const { gaState, setGaState } = useGAContext()
  const { UIOptions } = useUIOptions()
  const event_type = 'Assistant'

  const getPageType = (isPublicTemplate = false) => {
    let pageType = ''
    switch (pathname) {
      case '/':
        pageType = 'all_va_page'
        break
      case '/allbots':
        pageType = 'allbots'
        break
      case '/yourbots':
        pageType = 'yourbots'
        break
      default:
        pageType = isPublicTemplate ? 'va_template_page' : 'va_skillset_page'
        break
    }
    return pageType
  }

  const getView = (page_type: string): string => {
    if (['va_template_page', 'va_skillset_page'].includes(page_type))
      return 'none'
    return UIOptions[consts.IS_TABLE_VIEW] ? 'list' : 'card'
  }

  const vaPageOpen = () => {
    ga4.event('VA_Page_Opened', {
      auth_status: isAuth,
      event_type,
    })
  }

  const createVaClick = (source_type: string, template?: BotInfoInterface) => {
    const creatingVaFromScratch = !template
    const isDuplicated =
      !creatingVaFromScratch && template.author.id === auth?.user?.id
    const page_type = getPageType(!isDuplicated)
    const view = getView(page_type)

    const currentState = {
      assistant: template,
      source_type,
      view,
      isDuplicated,
      creatingVaFromScratch,
      auth_status: isAuth,
    }
    if (!isAuth) saveBeforeLoginAnalyticsState(currentState)

    setGaState(prev => {
      return {
        ...prev,
        ...currentState,
      }
    })

    creatingVaFromScratch
      ? ga4.event('Create_VA_From_Scratch_Button_Click', {
          source_type: pathname === '/' ? source_type : 'va_block',
          page_type,
          view,
          event_type,
        })
      : ga4.event('Create_VA_From_Template_Button_Click', {
          source_type,
          page_type,
          view,
          auth_status: isAuth,
          template_va_id: template.id,
          template_va_name: template.display_name,
          template_va_author_id: template.author.id,
          template_va_author_name: template.author.name || 'none',
          template_va_language: template.language?.value,
          event_type,
        })
  }

  const vaCreated = () => {
    const {
      source_type,
      view,
      isDuplicated,
      creatingVaFromScratch,
      assistant,
      auth_status,
    } = gaState
    const page_type = getPageType()

    isDuplicated &&
      ga4.event('VA_Duplicated', {
        source_type,
        page_type,
        event_type,
      })

    creatingVaFromScratch &&
      ga4.event('VA_From_Scratch_Created', {
        source_type: pathname === '/' ? source_type : 'va_block',
        page_type,
        event_type,
      })

    !creatingVaFromScratch &&
      !isDuplicated &&
      ga4.event('VA_From_Template_Created', {
        source_type,
        page_type: getPageType(true),
        view,
        auth_status,
        template_va_id: assistant?.id,
        template_va_name: assistant?.display_name,
        template_va_author_id: assistant?.author.id,
        template_va_author_name: assistant?.author.name || 'none',
        template_va_language: assistant?.language?.value,
        event_type,
      })
  }

  const vaPropsOpened = (source_type: string, template?: BotInfoInterface) => {
    const isPublicTemplate = template?.visibility === 'PUBLIC_TEMPLATE'
    const page_type = getPageType(isPublicTemplate)
    const view = getView(page_type)

    isPublicTemplate
      ? ga4.event('Template_VA_Properties_Opened', {
          source_type,
          view,
          page_type,
          template_va_id: template?.id,
          template_va_name: template?.display_name,
          template_va_author_id: template?.author.id,
          template_va_author_name: template?.author.name || 'none',
          template_va_language: template?.language?.value,
          event_type,
        })
      : ga4.event('VA_Properties_Opened', {
          source_type,
          view,
          page_type,
          event_type,
        })
  }

  const setVaArchitectureOptions = (source_type: string) => {
    const view = UIOptions[consts.IS_TABLE_VIEW] ? 'list' : 'card'
    const page_type = getPageType()
    setGaState({ ...gaState, source_type, view, page_type })
  }

  const vaArchitectureOpened = (template?: BotInfoInterface) => {
    const isPublicTemplate = template?.visibility === 'PUBLIC_TEMPLATE'

    const view = gaState.view || 'none'
    const source_type = gaState.source_type || 'link'
    const page_type = gaState.page_type || 'link'

    isPublicTemplate
      ? ga4.event('Template_VA_Architecture_Opened', {
          source_type,
          view,
          page_type,
          template_va_id: template?.id,
          template_va_name: template?.display_name,
          template_va_author_id: template?.author.id,
          template_va_author_name: template?.author.name || 'none',
          template_va_language: template?.language?.value,
          event_type,
        })
      : ga4.event('VA_Opened', {
          source_type,
          view,
          page_type,
          va_id: template?.id,
          va_name: template?.display_name,
          va_language: template?.language?.value,
          event_type,
        })
  }

  const renameVaButtonClick = (source_type: string, bot: BotInfoInterface) => {
    const page_type = getPageType()
    const view = getView(page_type)

    setGaState(prev => ({
      ...prev,
      assistant: bot,
      source_type,
      view,
    }))

    ga4.event('Rename_VA_Button_Click', {
      source_type,
      page_type,
      view,
      va_id: bot.id,
      va_name: bot.display_name,
      va_language: bot?.language?.value,
      event_type,
    })
  }

  const vaRenamed = () => {
    const { source_type, view, assistant } = gaState
    const page_type = getPageType()

    ga4.event('VA_Renamed', {
      source_type,
      page_type,
      view,
      va_id: assistant?.id,
      va_name: assistant?.display_name,
      va_language: assistant?.language?.value,
      event_type,
    })
  }

  const deleteVaButtonClick = (source_type: string, bot: BotInfoInterface) => {
    const page_type = getPageType()
    const view = getView(page_type)

    setGaState(prev => ({
      ...prev,
      assistant: bot,
      source_type,
      view,
    }))

    ga4.event('Delete_VA_Button_Click', {
      source_type,
      page_type,
      view,
      va_id: bot.id,
      va_name: bot.display_name,
      template_va_id: bot.cloned_from_id,
      va_language: bot?.language?.value,
      event_type,
    })
  }

  const vaDeleted = () => {
    const { source_type, view, assistant } = gaState
    const page_type = getPageType()

    ga4.event('VA_Deleted', {
      source_type,
      page_type,
      view,
      va_id: assistant?.id,
      va_name: assistant?.display_name,
      va_language: assistant?.language?.value,
      template_va_id: assistant?.cloned_from_id,
      event_type,
    })
  }

  const vaViewChanged = () => {
    const page_type = getPageType()
    const view = getView(page_type) === 'card' ? 'list' : 'card'
    const source_type = 'top_panel'

    ga4.event('VA_View_Changed', { page_type, view, source_type, event_type })
  }

  const vaChangeDeployState = (
    eventName: 'VA_Undeployed' | 'VA_Deployed',
    source_type?: string
  ) => {
    const page_type = getPageType()
    const source = source_type || gaState.source_type

    ga4.event(eventName, { source_type: source, page_type, event_type })
  }

  return {
    vaPageOpen: safeFunctionWrapper(vaPageOpen),
    createVaClick: safeFunctionWrapper(createVaClick),
    vaCreated: safeFunctionWrapper(vaCreated),
    vaPropsOpened: safeFunctionWrapper(vaPropsOpened),
    setVaArchitectureOptions: safeFunctionWrapper(setVaArchitectureOptions),
    vaArchitectureOpened: safeFunctionWrapper(vaArchitectureOpened),
    renameVaButtonClick: safeFunctionWrapper(renameVaButtonClick),
    vaRenamed: safeFunctionWrapper(vaRenamed),
    deleteVaButtonClick: safeFunctionWrapper(deleteVaButtonClick),
    vaDeleted: safeFunctionWrapper(vaDeleted),
    vaViewChanged: safeFunctionWrapper(vaViewChanged),
    vaChangeDeployState: safeFunctionWrapper(vaChangeDeployState),
  }
}
