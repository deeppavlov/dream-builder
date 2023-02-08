import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthProvider'

export const PrivateRoute = ({ children }: any) => {
  // If not authorized redirect to main page
  if (!localStorage.getItem('user')) return <Navigate to='/' />

  // If authorized return Route
  return children
}
