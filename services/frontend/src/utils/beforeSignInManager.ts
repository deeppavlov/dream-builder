import { IBeforeLoginModal } from 'types/types'

export const saveBeforeLoginModal = (modal: IBeforeLoginModal) =>
  sessionStorage.setItem('db_before_login_modal', JSON.stringify(modal))

export const clearBeforeLoginModal = () =>
  sessionStorage.removeItem('db_before_login_modal')

export const getBeforeLoginModal = (): IBeforeLoginModal | null => {
  const modal = sessionStorage.getItem('db_before_login_modal')
  return modal ? JSON.parse(modal) : null
}

export const saveBeforeLoginLocation = () =>
  sessionStorage.setItem('db_redirect_to', location.href)

export const getBeforeLoginLocation = () =>
  sessionStorage.getItem('db_redirect_to')

export const clearBeforeLoginLocation = () =>
  sessionStorage.removeItem('db_redirect_to')
