import axios from 'axios'
import { getAuthType } from 'utils/localStorageAuth'
import {
  getAccessToken,
  getLocale,
  setAccessToken,
} from 'utils/localStorageUser'
import { logout, updateAccessToken } from './user'

const { MODE } = import.meta.env

/**
 * Axios instance of public distribution API
 */
export const api = axios.create({
  baseURL: import.meta.env['VITE_DIST_API_URL_' + MODE],
})

export const apiFeedback = axios.create({
  baseURL: import.meta.env['VITE_FEEDBACK_API_URL_' + MODE],
})

apiFeedback.interceptors.request.use(
  config => {
    if (!config.headers?.token) {
      config.headers!.token = getAccessToken()
      config.headers!['auth-type'] = getAuthType()
    }
    return config
  },
  error => Promise.reject(error)
)

/**
 * Axios instance of authorization API
 */
export const authApi = axios.create({
  baseURL: import.meta.env['VITE_AUTH_API_URL_' + MODE],
})

authApi.interceptors.request.use(
  config => {
    if (!config.headers?.token) {
      config.headers!.token = getAccessToken()
      config.headers!['auth-type'] = getAuthType()
    }
    return config
  },
  error => Promise.reject(error)
)

/**
 * Axios instance of private distribution API
 */
export const privateApi = axios.create({
  baseURL: import.meta.env['VITE_DIST_API_URL_' + MODE],
})

privateApi.interceptors.request.use(
  config => {
    if (!config.headers?.token) {
      config.headers!.token = getAccessToken()
      config.headers!.lang = getLocale()
      config.headers!['auth-type'] = getAuthType()
    }
    return config
  },
  error => Promise.reject(error)
)

privateApi.interceptors.response.use(
  response => response,
  async error => {
    const prevRequest = error?.config
    const expiredTokenMsg = error.response.data?.detail
      ?.toString()
      ?.match(/Access token has expired or token is bad/gi)
    const userDoesntExist =
      error.response.data?.detail
        ?.toString()
        ?.match(/User is not listed in the database/gi)?.length > 0
    const accessTokenIsExpired =
      error?.response?.status === 400 &&
      expiredTokenMsg !== null &&
      expiredTokenMsg !== undefined
    const accessTokenIsExist = getAccessToken() !== null
    const accessTokenIsValid =
      !accessTokenIsExpired && accessTokenIsExist && !userDoesntExist

    if (!accessTokenIsValid && !prevRequest?.sent) {
      prevRequest.sent = true // Avoid unnecessary repeat on one request
      try {
        const { data } = await updateAccessToken()
        setAccessToken(data.token)
        prevRequest.headers.token = data.token
        // console.log('Access token successfully updated!')
      } catch (error) {
        // Logout if update access token is failed
        const isUser = localStorage.getItem('user') !== null // Prevent infinity logout
        // console.log('Update access token is failed!')
        isUser && logout()
        return Promise.reject(error)
      }

      return privateApi(prevRequest)
    }

    return Promise.reject(error)
  }
)
