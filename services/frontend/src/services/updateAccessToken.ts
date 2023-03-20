import { getRefreshToken } from '../Context/AuthProvider'
import { authApi } from './axiosConfig'

export const updateAccessToken = async () =>
  await authApi.post(`update_token?refresh_token=${getRefreshToken()}`)
