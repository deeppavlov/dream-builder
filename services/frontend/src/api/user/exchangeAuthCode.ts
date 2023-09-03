import { authApi } from 'api/axiosConfig'
import { getBeforeLoginLocation } from 'utils/beforeSignInManager'
import { setLocalStorageUser } from 'utils/localStorageUser'

const getClearUrl = (url: string) => {
  var urlOject = new URL(url)
  urlOject.hash = ''
  urlOject.search = ''
  return urlOject.toString()
}

export const exchangeAuthCode = (
  code: string,
  authType: 'google' | 'github'
) => {
  let axiosConfig = {
    mode: 'no-cors',
    headers: {
      'auth-type': authType,
    },
  }

  authApi
    .post(`exchange_authcode?auth_code=${code}`, '', axiosConfig)
    .then(({ data }) => setLocalStorageUser(data))
    .catch(() => console.log('ExchangeAuthCode failed!'))
    .finally(() => {
      const beforeLoginUrl =
        getBeforeLoginLocation() ?? getClearUrl(location.origin)
      location.href = beforeLoginUrl
    })
}
