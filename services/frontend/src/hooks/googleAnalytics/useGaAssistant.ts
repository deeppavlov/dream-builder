import { useAuth, useUIOptions } from 'context'
import { useGAContext } from 'context'
import ga4 from 'react-ga4'
import { useLocation } from 'react-router-dom'
import { BotInfoInterface } from 'types/types'
import { consts } from 'utils/consts'

export const useGaAssistant = () => {
  const auth = useAuth()
  const isAuth = !!auth?.user
  const location = useLocation()
  const { gaState, setGaState } = useGAContext()
  const { UIOptions } = useUIOptions()

  const getPageType = (isPublicTemplate = false) => {
    let pageType = ''
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
    })
  }

  const createVaClick = (source: string, template?: BotInfoInterface) => {
    const creatingVaFromScratch = !template
    const isDuplicated =
      !creatingVaFromScratch && template.author.id === auth?.user?.id
    const page_type = getPageType(!isDuplicated)
    const view = getView(page_type)

    setGaState(prev => {
      return {
        ...prev,
        assistant: template,
        source,
        view,
        isDuplicated,
        creatingVaFromScratch,
      }
    })

    creatingVaFromScratch
      ? ga4.event('Create_VA_From_Scratch_Button_Click', {
          page_type,
          source,
          view,
        })
      : ga4.event('Create_VA_From_Template_Button_Click', {
          source,
          page_type,
          view,
          auth_status: isAuth,
          template_va_id: template.id,
          template_va_name: template.display_name,
          template_va_author_id: template.author.id,
          template_va_author_name: template.author.fullname || 'none',
        })
  }

  const vaCreated = () => {
    const { source, view, isDuplicated, creatingVaFromScratch, assistant } =
      gaState
    const page_type = getPageType()

    isDuplicated &&
      ga4.event('VA_Duplicated', {
        source,
        page_type,
      })

    creatingVaFromScratch &&
      ga4.event('VA_From_Scratch_Created', {
        source,
        page_type,
      })

    !creatingVaFromScratch &&
      !isDuplicated &&
      ga4.event('VA_From_Template_Created', {
        source,
        page_type: getPageType(true),
        view,
        auth_status: isAuth,
        template_va_id: assistant?.id,
        template_va_name: assistant?.display_name,
        template_va_author_id: assistant?.author.id,
        template_va_author_name: assistant?.author.fullname || 'none',
      })
  }

  const vaPropsOpened = (source: string, template?: BotInfoInterface) => {
    const isPublicTemplate = template?.visibility === 'PUBLIC_TEMPLATE'
    const page_type = getPageType(isPublicTemplate)
    const view = getView(page_type)

    isPublicTemplate
      ? ga4.event('Template_VA_Properties_Opened', {
          source,
          view,
          page_type,
          template_va_id: template?.id,
          template_va_name: template?.display_name,
          template_va_author_id: template?.author.id,
          template_va_author_name: template?.author.fullname || 'none',
        })
      : ga4.event('VA_Properties_Opened', {
          source,
          view,
          page_type,
        })
  }

  const setVaArchitectureOptions = (source: string) => {
    const view = UIOptions[consts.IS_TABLE_VIEW] ? 'list' : 'card'
    const page_type = getPageType()
    setGaState({ ...gaState, source, view, page_type })
  }

  const vaArchitectureOpened = (template?: BotInfoInterface) => {
    const isPublicTemplate = template?.visibility === 'PUBLIC_TEMPLATE'

    const view = gaState.view || 'none'
    const source = gaState.source || 'link'
    const page_type = gaState.page_type || 'link'

    isPublicTemplate
      ? ga4.event('Template_VA_Architecture_Opened', {
          source,
          view,
          page_type,
          template_va_id: template?.id,
          template_va_name: template?.display_name,
          template_va_author_id: template?.author.id,
          template_va_author_name: template?.author.fullname || 'none',
        })
      : ga4.event('VA_Opened', {
          source,
          view,
          page_type,
          va_id: template?.id,
          va_name: template?.display_name,
        })
  }

  const renameVaButtonClick = (source: string, bot: BotInfoInterface) => {
    const page_type = getPageType()
    const view = getView(page_type)

    setGaState(prev => ({
      ...prev,
      assistant: bot,
      source,
      view,
    }))

    ga4.event('Rename_VA_Button_Click', {
      source,
      page_type,
      view,
      va_id: bot.id,
      va_name: bot.display_name,
    })
  }

  const vaRenamed = () => {
    const { source, view, assistant } = gaState
    const page_type = getPageType()

    ga4.event('VA_Renamed', {
      source,
      page_type,
      view,
      va_id: assistant?.id,
      va_name: assistant?.display_name,
    })
  }

  const deleteVaButtonClick = (source: string, bot: BotInfoInterface) => {
    const page_type = getPageType()
    const view = getView(page_type)

    setGaState(prev => ({
      ...prev,
      assistant: bot,
      source,
      view,
    }))

    ga4.event('Delete_VA_Button_Click', {
      source,
      page_type,
      view,
      va_id: bot.id,
      va_name: bot.display_name,
      template_va_id: bot.cloned_from_id,
    })
  }

  const vaDeleted = () => {
    const { source, view, assistant } = gaState
    const page_type = getPageType()

    ga4.event('VA_Deleted', {
      source,
      page_type,
      view,
      va_id: assistant?.id,
      va_name: assistant?.display_name,
      template_va_id: assistant?.cloned_from_id,
    })
  }

  const vaViewChanged = () => {
    const page_type = getPageType()
    const view = getView(page_type) === 'card' ? 'list' : 'card'
    const source = 'top_panel'

    ga4.event('VA_View_Changed', { page_type, view, source })
  }

  return {
    vaPageOpen,
    createVaClick,
    vaCreated,
    vaPropsOpened,
    setVaArchitectureOptions,
    vaArchitectureOpened,
    renameVaButtonClick,
    vaRenamed,
    deleteVaButtonClick,
    vaDeleted,
    vaViewChanged,
  }
}
