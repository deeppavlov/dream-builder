import { privateApi } from './axiosConfig'

export async function postDeploy(virtual_assistant_id: number) {
  try {
    const { data } = await privateApi.post(`/deployments/`, {
      virtual_assistant_id: virtual_assistant_id,
    })
    return data
  } catch (e) {
    throw e
  }
}
