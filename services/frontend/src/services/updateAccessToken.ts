import { getRefreshToken, setAccessToken } from '../context/AuthProvider'
import { authApi } from './axiosConfig'

export const updateAccessToken = async () => {
  const response = await authApi
    .post(`update_token?refresh_token=${getRefreshToken()}`)
    .then(res => {
      setAccessToken(res.data.token)
      return res
    })

  return response.data.token
}
