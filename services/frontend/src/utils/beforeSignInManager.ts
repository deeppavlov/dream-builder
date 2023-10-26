import { IBeforeLoginModal, IGaOptions } from 'types/types'

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

export const saveBeforeLoginAnalyticsState = (state: IGaOptions): void => {
  sessionStorage.setItem('GA_state', JSON.stringify(state))
}

export const getBeforeLoginAnalyticsState = (): IGaOptions | null => {
  const state = sessionStorage.getItem('GA_state')
  return state ? JSON.parse(state) : null
}

export const clearBeforeLoginAnalyticsState = (): void => {
  sessionStorage.removeItem('GA_state')
}
