import axios from 'axios'
import { getAccessToken, logout, setAccessToken } from '../context/AuthProvider'
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

        console.log(data.token)
        setAccessToken(data.token)
        prevRequest.headers.token = data.token
      } catch (error) {
        // Logout if update access token is failed
        console.log('Update access token is failed')
        logout()
        return
      }

      return privateApi(prevRequest)
    }
  }
)
