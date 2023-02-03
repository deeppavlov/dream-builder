import axios from 'axios'

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
