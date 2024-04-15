import { UserInterface } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export async function getUsers(): Promise<UserInterface[]> {
  try {
    const { data } = await privateApi.get(`/users`)
    return data
  } catch (e) {
    throw e
  }
}
