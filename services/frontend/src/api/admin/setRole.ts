import { UserInterface } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export async function setRole(
  user_id: number,
  role_id: number
): Promise<UserInterface[]> {
  try {
    const { data } = await privateApi.put(`/users/${user_id}`, {
      id: user_id,
      role_id,
    })
    return data
  } catch (e) {
    throw e
  }
}
