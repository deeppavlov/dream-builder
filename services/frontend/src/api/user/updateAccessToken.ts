import { authApi } from 'api/axiosConfig'
import { getRefreshToken } from 'utils/localStorageUser'

export const updateAccessToken = async () =>
  await authApi.post(`update_token?refresh_token=${getRefreshToken()}`)
