import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { TEvents, UserContext, UserInterface } from 'types/types'
import { useObserver } from 'hooks/useObserver'
import {
  clearBeforeLoginLocation,
  clearBeforeLoginModal,
  getBeforeLoginLocation,
  getBeforeLoginModal,
} from 'utils/beforeSignInManager'
import { trigger } from 'utils/events'
import { getLocalStorageUser } from 'utils/localStorageUser'

export const AuthContext = createContext<UserContext | null>(null)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children?: JSX.Element }) => {
  const [user, setUser] = useState<UserInterface | null>(null)
  const updateUser = () => {
    const localStorageUser = getLocalStorageUser()

    console.log('user = ', user)
    if (user === null && localStorageUser !== null) {
      setUser(localStorageUser)
    } else if (user === null && localStorageUser === null) {
      setUser(null)
    }
  }
  useEffect(() => {
    updateUser()
  }, [])

  useObserver('storage', updateUser)
  // requested before login Modal window,
  // and clear sessionStorage states
  useEffect(() => {
    const beforeLoginUrl = getBeforeLoginLocation()

    if (!beforeLoginUrl || user === null) return

    const beforeLoginModal = getBeforeLoginModal()

    if (beforeLoginModal && location.href === beforeLoginUrl)
      trigger(beforeLoginModal.name as TEvents, beforeLoginModal.options)

    clearBeforeLoginLocation()
    clearBeforeLoginModal()
  }, [user])

  const userContextValue = useMemo(
    () => ({
      user,
    }),
    [user]
  )

  return (
    <AuthContext.Provider value={userContextValue}>
      {children}
    </AuthContext.Provider>
  )
}
