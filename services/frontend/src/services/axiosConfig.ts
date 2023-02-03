import axios from 'axios'
import { trigger } from '../utils/events'
// import { deleteLocalStorageUser } from './AuthProvider'

export const api = axios.create({
  baseURL: import.meta.env.VITE_DIST_API_URL,
})

const handleBadTokenResponse = () => {
  localStorage.removeItem('token')
  // deleteLocalStorageUser()
  trigger('ErrorMessageModal', 'bad token')
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
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (
      error.response.status === 400 &&
      error.response.data?.detail === 'bad token'
    ) {
      handleBadTokenResponse()
    }
    return Promise.reject(error)
  }
)
