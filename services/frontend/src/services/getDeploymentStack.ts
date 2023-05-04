import { api } from './axiosConfig'

export async function getDeploymentStack() {
  try {
    const { data } = await api.get(`/deployments/stacks`)
    return data
  } catch (e) {
    throw e
  }
}
