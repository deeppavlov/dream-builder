import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import store from 'store2'
import { UserInterface } from 'types/types'

export const AdminRoute = ({ children }: any) => {
  const user: UserInterface = store('user')
  const isAdmin = user?.role.id === 2 || user?.role.id === 3
  const n = useNavigate()

  useEffect(() => {
    // If not admin redirect to main page
    !isAdmin && n('/')
  }, [user?.role.id])

  // If admin return Route
  return children
}
