import { authApi } from 'api/axiosConfig'
import { deleteLocalStorageUser, getRefreshToken } from 'utils/localStorageUser'

export const logout = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) console.log('Refresh token not exist for Logout!')

  let axiosConfig = {
    mode: 'no-cors',
    headers: { ['refresh-token']: refreshToken },
  }

  try {
    await authApi.put(`logout`, {}, axiosConfig)
  } catch (error) {
    console.log('Logout failed!', error)
  }

  deleteLocalStorageUser()
}
