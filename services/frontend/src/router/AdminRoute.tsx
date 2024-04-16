import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import store from 'store2'
import { UserInterface } from 'types/types'
import { RoutesList } from './RoutesList'

export const AdminRoute = ({ children }: any) => {
  const user: UserInterface = store('user')
  const isAdmin = user?.role.id === 3
  const isModerator = user?.role.id === 2
  const n = useNavigate()

  const { pathname } = useLocation()

  useEffect(() => {
    // If not admin redirect to main page
    if (!isAdmin && !isModerator) n(RoutesList.start)
    if (pathname === RoutesList.admin.users && !isAdmin)
      n(RoutesList.admin.default)
  }, [user?.role.id])

  // If admin return Route
  return children
}
