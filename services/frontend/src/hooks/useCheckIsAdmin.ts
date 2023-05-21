import store from 'store2'
import { UserInterface } from '../types/types'

export const useCheckIsAdmin = () => {
  const q = import.meta.env?.VITE_ADMINS?.split(' ')
  const user: UserInterface = store('user')
  const isAdmin = q.includes(user?.email)

  return isAdmin
}
