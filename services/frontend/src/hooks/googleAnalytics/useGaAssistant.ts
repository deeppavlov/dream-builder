import { useAuth } from 'context'
import ga4 from 'react-ga4'
import { useLocation } from 'react-router-dom'
import { BotInfoInterface } from 'types/types'
import { useGAContext } from 'context/GaContext'

export const useGaAssistant = () => {
  const auth = useAuth()
  const isAuth = !!auth?.user
  const location = useLocation()
  const { gaState, setGaState } = useGAContext()

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

  const vaPageOpen = () => {
    ga4.event('VA_Page_Opened', {
      auth_status: isAuth,
    })
  }

  const createVaClick = (
    source: string,
    view: 'card' | 'list' | 'none',
    template?: BotInfoInterface
  ) => {
    const creatingVaFromScratch = !template
    const isDuplicated =
      !creatingVaFromScratch && template.author.id === auth?.user?.id
    setGaState(prev => {
      return {
        ...prev,
        vaTemplate: template,
        vaTemplateSource: source,
        vaTemplateView: view,
        isDuplicated,
        creatingVaFromScratch,
      }
    })

    creatingVaFromScratch
      ? ga4.event('Create_VA_From_Scratch_Button_Click', {
          page_type: getPageType(),
          source,
          view,
        })
      : ga4.event('Create_VA_From_Template_Button_Click', {
          source,
          page_type: getPageType(!isDuplicated),
          view,
          auth_status: isAuth,
          template_va_id: template.id,
          template_va_name: template.name,
          template_va_author_id: template.author.id,
          template_va_author_name: template.author.fullname || 'none',
        })
  }

  const vaCreated = () => {
    const {
      vaTemplateSource,
      vaTemplateView,
      isDuplicated,
      creatingVaFromScratch,
      vaTemplate,
    } = gaState
    const page_type = getPageType()

    isDuplicated &&
      ga4.event('VA_Duplicated', {
        source: vaTemplateSource,
        page_type,
      })

    creatingVaFromScratch &&
      ga4.event('VA_From_Scratch_Created', {
        source: vaTemplateSource,
        page_type,
      })

    !creatingVaFromScratch &&
      !isDuplicated &&
      ga4.event('VA_From_Template_Created', {
        source: vaTemplateSource,
        page_type: getPageType(true),
        view: vaTemplateView,
        auth_status: isAuth,
        template_va_id: vaTemplate?.id,
        template_va_name: vaTemplate?.name,
        template_va_author_id: vaTemplate?.author.id,
        template_va_author_name: vaTemplate?.author.fullname || 'none',
      })
  }

  const vaPropsOpened = (
    source: string,
    view: 'card' | 'list' | 'none',
    template?: BotInfoInterface
  ) => {
    const isPublicTemplate = template?.visibility === 'PUBLIC_TEMPLATE'
    const page_type = getPageType(isPublicTemplate)

    isPublicTemplate
      ? ga4.event('Template_VA_Properties_Opened', {
          source,
          view,
          page_type,
          template_va_id: template?.id,
          template_va_name: template?.name,
          template_va_author_id: template?.author.id,
          template_va_author_name: template?.author.fullname || 'none',
        })
      : ga4.event('VA_Properties_Opened', {
          source,
          view,
          page_type,
        })
  }

  return {
    vaPageOpen,
    createVaClick,
    vaCreated,
    vaPropsOpened,
  }
}
