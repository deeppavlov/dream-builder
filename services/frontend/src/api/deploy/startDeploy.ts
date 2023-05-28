import { privateApi } from 'api/axiosConfig'

export async function startDeploy(virtual_assistant_name: string) {
  try {
    const { data } = await privateApi.post(`/deployments`, {
      virtual_assistant_name: virtual_assistant_name,
      // error:true
    })
    return data
  } catch (e) {
    throw e
  }
}
