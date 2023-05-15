import { IDeploymentState } from '../types/types'
import { privateApi } from './axiosConfig'

export async function getDeployments(): Promise<IDeploymentState[]> {
  try {
    const { data } = await privateApi.get(`/deployments?state=UP`)
    return data
  } catch (e) {
    throw e
  }
}
