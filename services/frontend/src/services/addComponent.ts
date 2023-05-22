import { privateApi } from './axiosConfig'

export async function addComponent(dist_name: string, component_id: number) {
  try {
    const { data } = await privateApi.post(
      `/assistant_dists/${dist_name}/components`,
      { component_id }
    )
    return data
  } catch (e) {
    throw e
  }
}
