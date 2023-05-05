import { privateApi } from './axiosConfig'

export async function patchDeploy(
  deployment_id: number,
  lm_service_id: number,
  prompt: string
) {
  try {
    const { data } = await privateApi.patch(`/deployments/${deployment_id}`, {
      lm_service_id: lm_service_id,
      prompt: prompt,
    })
    return data
  } catch (e) {
    throw e
  }
}
