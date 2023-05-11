import { Navigate } from 'react-router-dom'
import store from 'store2'
import { UserInterface } from '../types/types'

export const AdminRoute = ({ children }: any) => {
  // If not admin redirect to main page

  const q = import.meta.env.VITE_ADMINS.split(', ')
  const user: UserInterface = store('user')
  const isAdmin = q.includes(user?.email)

  if (!localStorage.getItem('user') || !isAdmin) return <Navigate to='/' />

  // If authorized return Route
  return children
}
