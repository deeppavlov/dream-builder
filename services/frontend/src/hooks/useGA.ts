import { useAuth } from 'context'
import { useGAContext } from 'context/GaContext'
import ga4 from 'react-ga4'
import { useLocation } from 'react-router-dom'

export const useGA = () => {
  const auth = useAuth()
  const isAuth = !!auth?.user
  const location = useLocation()
  const { gaState, setGaState } = useGAContext()

  const vaPageOpen = () => {
    ga4.event('VA_Page_Opened', {
      auth_status: isAuth,
    })
  }

  const createVaFromTemplateButtonClick = (
    source: string,
    view: 'card' | 'list' | 'none',
    item: {
      id: number
      name: string
      authorId: number
      authorName: string
    },
    isDuplicated = false,
  ) => {
    const page_type =
      location.pathname === '/'
        ? 'all_va_page'
        : location.pathname === '/allbots'
        ? 'allbots'
        : 'va_template_page'

    setGaState(prev => {
      return {
        ...prev,
        vaTemplateSource: source,
        vaTemplateView: view,
        isDuplicated,
      }
    })
    ga4.event('Create_VA_From_Template_Button_Click', {
      source,
      page_type,
      view,
      auth_status: isAuth,
      template_va_id: item.id,
      template_va_name: item.name,
      template_va_author_id: item.authorId,
      template_va_author_name: item.authorName,
    })
  }

  const creatingVaFromTemplate = (item: {
    id: number
    name: string
    authorId: number
    authorName: string
  }) => {
    const { vaTemplateSource, vaTemplateView, isDuplicated, ...newState } =
      gaState
    setGaState(newState)
    const page_type =
      location.pathname === '/'
        ? 'all_va_page'
        : location.pathname === '/allbots'
        ? 'allbots'
        : 'va_template_page'

    isDuplicated
      ? ga4.event('VA_Duplicated', {
          source: vaTemplateSource,
          page_type,
        })
      : ga4.event('VA_From_Template_Created', {
          source: vaTemplateSource,
          page_type,
          view: vaTemplateView,
          auth_status: isAuth,
          template_va_id: item.id,
          template_va_name: item.name,
          template_va_author_id: item.authorId,
          template_va_author_name: item.authorName,
        })
  }

  return {
    vaPageOpen,
    createVaFromTemplateButtonClick,
    creatingVaFromTemplate,
  }
}
