import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { UserContext, UserInterface } from 'types/types'
import {
  clearBeforeLoginAnalyticsState,
  clearBeforeLoginLocation,
  clearBeforeLoginModal,
  getBeforeLoginAnalyticsState,
  getBeforeLoginLocation,
  getBeforeLoginModal,
} from 'utils/beforeSignInManager'
import { trigger } from 'utils/events'
import {
  deleteLocalStorageUser,
  getLocalStorageUser,
  setLocalStorageUser,
} from 'utils/localStorageUser'
import { AssistantDialogSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { useGAContext } from './GaContext'

export const AuthContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
})
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children?: JSX.Element }) => {
  const [user, setUser] = useState<UserInterface | null>(getLocalStorageUser())
  const { setGaState } = useGAContext()

  useEffect(() => {
    if (user) setLocalStorageUser(user)
    else {
      deleteLocalStorageUser()
    }
  }, [user])

  // Trigger requested before login Modal window,
  // and clear sessionStorage states
  useEffect(() => {
    const beforeLoginUrl = getBeforeLoginLocation()

    if (!beforeLoginUrl || user === null) return

    const beforeLoginModal = getBeforeLoginModal()

    if (beforeLoginModal && location.href === beforeLoginUrl) {
      if (beforeLoginModal.name === TRIGGER_RIGHT_SP_EVENT) {
        trigger(TRIGGER_RIGHT_SP_EVENT, {
          childData: {
            key: beforeLoginModal.options.dist.name + 'chat_with_assistant',
            dist: beforeLoginModal.options.dist,
            componentName: 'AssistantDialogSidePanel',
          },
        })
      } else {
        trigger(beforeLoginModal.name, beforeLoginModal.options)
      }
    }

    const beforeLoginAnalyticsState = getBeforeLoginAnalyticsState()
    if (beforeLoginAnalyticsState) {
      setGaState(beforeLoginAnalyticsState)
      clearBeforeLoginAnalyticsState()
    }

    clearBeforeLoginLocation()
    clearBeforeLoginModal()
  }, [user])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user') {
        // event.newValue has the type string | null
        typeof event.newValue === 'string'
          ? setUser(JSON.parse(event.newValue))
          : setUser(event.newValue) // null
        location.reload()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const userContextValue = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  )

  return (
    <AuthContext.Provider value={userContextValue}>
      {children}
    </AuthContext.Provider>
  )
}
