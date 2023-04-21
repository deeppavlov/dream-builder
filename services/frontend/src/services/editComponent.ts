import { privateApi } from './axiosConfig'

export async function editComponent() {
  try {
    const { data } = await privateApi.patch(``)

    return data
  } catch (e) {
    throw e
  }
}
