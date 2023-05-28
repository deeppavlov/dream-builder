import { privateApi } from 'api/axiosConfig'

export async function deleteComoponent(
  dist_name: string,
  virtual_assistant_component_id: number
) {
  try {
    const { data } = await privateApi.delete(
      `/assistant_dists/${dist_name}/components/${virtual_assistant_component_id}`
    )
    return data
  } catch (e) {
    throw e
  }
}
