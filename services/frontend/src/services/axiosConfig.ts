import axios, { AxiosError } from 'axios'
import { trigger } from '../utils/events'
import { deleteLocalStorageUser } from './AuthProvider'

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

const handleErrorResponse = (error: AxiosError) => {
  localStorage.removeItem('token')
  deleteLocalStorageUser()
  trigger(
    'ErrorMessageModal',
    `${JSON.stringify(error?.response?.data, undefined, 2)}`
  )
}

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response
  },
  function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const tokenIsLost =
      error.config?.headers?.token === null ||
      error.config?.headers?.token === undefined

    if (error?.response?.status === 400 || tokenIsLost) {
      handleErrorResponse(error)
    }

    return Promise.reject(error)
  }
)
