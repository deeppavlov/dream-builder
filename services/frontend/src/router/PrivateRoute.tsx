import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import store from 'store2'
import { useObserver } from 'hooks/useObserver'

export const PrivateRoute = ({ children }: any) => {
  const [isAuth, setIsAuth] = useState(store('user'))
  useObserver('logout', () => setIsAuth(null))

  // If not authorized redirect to main page
  if (!isAuth) return <Navigate to='/' />
  // If authorized return Route
  return children
}
