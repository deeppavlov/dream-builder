import axios from 'axios'
import { useEffect } from 'react'
import { getAccessToken, useAuth } from '../Router/AuthProvider'
import { updateAccessToken } from '../services/updateAccessToken'

/**
 * Axios instance of private distribution API
 */
const privateApi = axios.create({
  baseURL: import.meta.env.VITE_DIST_API_URL,
  headers: { token: getAccessToken() },
})

const usePrivateApi = () => {
  const refresh = updateAccessToken()
  const auth = useAuth()

  useEffect(() => {
    const responseIntercept = privateApi.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config
        const accessTokenIsExpired =
          error?.response?.status === 400 &&
          error.response.data?.detail === 'Date of token is not valid!'

        if (accessTokenIsExpired && !prevRequest?.sent) {
          prevRequest.sent = true // Avoid unnecessary repeat on one request
          const newAccessToken = await updateAccessToken()

          // Logout if update access token is failed
          if (!newAccessToken) {
            await auth?.logout()
            return
          }

          prevRequest.headers.token = newAccessToken
          return privateApi(prevRequest)
        }
      }
    )

    return () => {
      privateApi.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return privateApi
}

export default usePrivateApi
