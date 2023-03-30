import { privateApi } from './axiosConfig'

export async function getUserId() {
  try {
    const { data } = await privateApi.get('users/self')
    return data
  } catch (e) {
    throw e
  }
}
