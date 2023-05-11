import { privateApi } from './axiosConfig'

export async function getDeployments() {
  try {
    const { data } = await privateApi.get(`/deployments?state=UP`)
    return data
  } catch (e) {
    throw e
  }
}
