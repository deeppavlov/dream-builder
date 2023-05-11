import { Navigate } from 'react-router-dom'
import store from 'store2'
import { UserInterface } from '../types/types'

export const PrivateRoute = ({ children }: any) => {
  // If not authorized redirect to main page

  const q = import.meta.env.VITE_ADMINS.split(', ')
  const user: UserInterface = store('user')
  const isAdmin = q.includes(user?.email)
  console.log('isAdmin = ', isAdmin)
  console.log(!localStorage.getItem('user') || !isAdmin)
  if (!localStorage.getItem('user') && isAdmin) return <Navigate to='/' />

  // If authorized return Route
  return children
}
