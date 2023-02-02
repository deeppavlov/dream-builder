import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export const PrivateRoute = ({ children }: any) => {
  const auth = useAuth()

  // If not authorized redirect to main page
  if (auth?.user === null) return <Navigate to='/' />

  // If authorized return Route
  return children
}
