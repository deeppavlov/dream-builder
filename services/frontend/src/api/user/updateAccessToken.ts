import { getRefreshToken } from 'context/AuthProvider'
import { authApi } from 'api/axiosConfig'

export const updateAccessToken = async () =>
  await authApi.post(`update_token?refresh_token=${getRefreshToken()}`)
