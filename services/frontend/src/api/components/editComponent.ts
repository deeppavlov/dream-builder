import { PostDistParams } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export async function editComponent(
  newData: PostDistParams,
  component_id: number
) {
  try {
    const { data } = await privateApi.patch(`/components/${component_id}`, {
      ...newData,
    })
    return data
  } catch (e) {
    throw e
  }
}
