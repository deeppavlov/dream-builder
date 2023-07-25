import { authApi } from 'api/axiosConfig'
import { getBeforeLoginLocation } from 'utils/beforeSignInManager'
import { trigger } from 'utils/events'
import { setLocalStorageUser } from 'utils/localStorageUser'

const getClearUrl = (url: string) => {
  var urlOject = new URL(url)
  urlOject.hash = ''
  urlOject.search = ''
  return urlOject.toString()
}

export const exchangeAuthCode = async (code: string) => {
  let axiosConfig = {
    mode: 'no-cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }

  await authApi
    .post(`exchange_authcode?auth_code=${code}`, axiosConfig)
    .then(({ data }) => {
      setLocalStorageUser(data)
      trigger('login', {})
    })
    .catch(() => console.log('ExchangeAuthCode failed!'))

  const beforeLoginUrl =
    getBeforeLoginLocation() ?? getClearUrl(location.origin)
  return beforeLoginUrl
}
