import axios from 'axios'
import { getAccessToken, logout, setAccessToken } from '../context/AuthProvider'
import { updateAccessToken } from './updateAccessToken'

export const mode =
  import.meta.env.MODE === 'production'
    ? 'PROD'
    : import.meta.env.MODE === 'msw'
    ? 'MSW'
    : 'DEV'
/**
 * Axios instance of public distribution API
 */
export const api = axios.create({
  baseURL: import.meta.env['VITE_DIST_API_URL_' + mode],
})

/**
 * Axios instance of authorization API
 */
export const authApi = axios.create({
  baseURL: import.meta.env['VITE_AUTH_API_URL_' + mode],
})

/**
 * Axios instance of private distribution API
 */
export const privateApi = axios.create({
  baseURL: import.meta.env['VITE_DIST_API_URL_' + mode],
})

privateApi.interceptors.request.use(
  config => {
    if (!config.headers?.token) {
      config.headers!.token = getAccessToken()
    }
    return config
  },
  error => Promise.reject(error)
)

privateApi.interceptors.response.use(
  response => response,
  async error => {
    const prevRequest = error?.config
    const errorMsg = error.response.data?.detail
      ?.toString()
      ?.match(/Access token has expired or token is bad/gi)
    const accessTokenIsExpired =
      error?.response?.status === 400 &&
      errorMsg !== null &&
      errorMsg !== undefined
    const accessTokenIsExist = getAccessToken() !== null
    const accessTokenIsValid = !accessTokenIsExpired && accessTokenIsExist

    console.log(`Access token is valid: ${accessTokenIsValid}`)

    if (!accessTokenIsValid && !prevRequest?.sent) {
      prevRequest.sent = true // Avoid unnecessary repeat on one request

      try {
        const { data } = await updateAccessToken()
        setAccessToken(data.token)
        prevRequest.headers.token = data.token
        console.log('Access token successfully updated!')
      } catch (error) {
        // Logout if update access token is failed
        const isUser = localStorage.getItem('user') !== null // Prevent infinity logout
        console.log('Update access token is failed!')
        isUser && logout()
        return
      }

      return privateApi(prevRequest)
    }
  }
)
