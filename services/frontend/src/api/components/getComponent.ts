import { privateApi } from 'api/axiosConfig'

export async function getComponent(id: number) {
  try {
    const { data } = await privateApi.get(`components/${id}`)
    return data
  } catch (e) {
    throw e
  }
}
