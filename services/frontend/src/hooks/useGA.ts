import { useAuth } from 'context'
import ga4 from 'react-ga4'

export const useGA = () => {
  const auth = useAuth()

  const vaPageOpen = () => {
    ga4.event('VA_Page_Opened', {
      auth_status: !!auth?.user,
    })
  }

  return {
    vaPageOpen,
  }
}
