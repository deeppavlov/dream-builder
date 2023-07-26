import { useAuth } from 'context'
import ga4 from 'react-ga4'
import { useLocation } from 'react-router-dom'

export const useGA = () => {
  const auth = useAuth()
  const isAuth = !!auth?.user
  const location = useLocation()

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
    }
  ) => {
    const page_type =
      location.pathname === '/'
        ? 'all_va_page'
        : location.pathname === '/allbots'
        ? 'allbots'
        : 'va_template_page'

    ga4.event('Create_VA_From_Template_Button_Click', {
      source,
      page_type,
      view,
      auth_shatus: isAuth,
      template_va_id: item.id,
      template_va_name: item.name,
      template_va_author_id: item.authorId,
      template_va_author_name: item.authorName,
    })
  }

  return {
    vaPageOpen,
    createVaFromTemplateButtonClick
  }
}
