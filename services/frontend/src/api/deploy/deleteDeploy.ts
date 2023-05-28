import { privateApi } from 'api/axiosConfig'

export async function deleteDeploy(deployment_id: number) {
  try {
    const { data } = await privateApi.delete(`/deployments/${deployment_id}`)
    return data
  } catch (e) {
    throw e
  }
}
