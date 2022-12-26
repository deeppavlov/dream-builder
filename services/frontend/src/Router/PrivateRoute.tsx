import { Navigate } from 'react-router-dom'
import { getUser } from '../services/AuthProvider'

export const PrivateRoute = ({ children }: any) => {
  const user = getUser()

  // If not authorized redirect to main page
  if (user === null) return <Navigate to='/' />

  // If authorized return Route
  return children
}
