import { privateApi } from './axiosConfig'

export async function getDeploy(deployment_id: number) {
  try {
    const { data } = await privateApi.get(`/deployments/${deployment_id}`)
    return data
  } catch (e) {
    throw e
  }
}
