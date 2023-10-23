import store from 'store2'

export const setAuthType = (type: 'google' | 'github'): void =>
  store.set('authType', type)

export const getAuthType = () => store.get('authType') || ''

export const removeAuthType = () => store.remove('authType')
