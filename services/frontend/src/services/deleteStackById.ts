import { privateApi } from './axiosConfig'

export async function deleteStackById(stack_id: number) {
  try {
    const { data } = await privateApi.delete(`/deployments/stacks/${stack_id}`)
    return data
  } catch (e) {
    throw e
  }
}
