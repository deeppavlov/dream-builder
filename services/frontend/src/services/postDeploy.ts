import { privateApi } from './axiosConfig'

export async function postDeploy(virtual_assistant_name: string) {
  try {
    const { data } = await privateApi.post(`/deployments/`, {
      virtual_assistant_name: virtual_assistant_name,
      // error:true
    })
    return data
  } catch (e) {
    throw e
  }
}
