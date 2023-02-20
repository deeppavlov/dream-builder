import axios from 'axios'
import { getAccessToken, logout } from '../context/AuthProvider'
import { updateAccessToken } from './updateAccessToken'

/**
 * Axios instance of public distribution API
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_DIST_API_URL,
})

/**
 * Axios instance of authorization API
 */
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
})

/**
 * Axios instance of private distribution API
 */
export const privateApi = axios.create({
  baseURL: import.meta.env.VITE_DIST_API_URL,
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
    const accessTokenIsExpired =
      error?.response?.status === 400 &&
      error.response.data?.detail?.match(
        /Access token has expired or token is bad/gi
      )

    console.log(`Access token is expired: ${accessTokenIsExpired}`)

    if (accessTokenIsExpired && !prevRequest?.sent) {
      prevRequest.sent = true // Avoid unnecessary repeat on one request
      const newAccessToken = await updateAccessToken()

      // Logout if update access token is failed
      if (!newAccessToken) {
        console.log('Update access token is failed')
        logout()
        return
      }

      prevRequest.headers.token = newAccessToken
      return privateApi(prevRequest)
    }
  }
)
