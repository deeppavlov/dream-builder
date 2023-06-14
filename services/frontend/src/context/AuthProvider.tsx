import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { UserContext, UserInterface } from 'types/types'
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

  useEffect(() => {
    const localStorageUser = getLocalStorageUser()

    if (user === null && localStorageUser !== null) {
      setUser(localStorageUser)
    }
  }, [])

  // Trigger requested before login Modal window,
  // and clear sessionStorage states
  useEffect(() => {
    const beforeLoginUrl = getBeforeLoginLocation()

    if (!beforeLoginUrl || user === null) return

    const beforeLoginModal = getBeforeLoginModal()

    if (beforeLoginModal && location.href === beforeLoginUrl)
      trigger(beforeLoginModal.name, beforeLoginModal.options)

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
