import { PostDistParams } from '../types/types'
import { privateApi } from './axiosConfig'

export async function editComponent(
  newData: PostDistParams,
  component_id: number
) {
  console.log('rename', component_id)

  try {
    const { data } = await privateApi.patch(`/components/${component_id}`, {
      ...newData,
    })
    return data
  } catch (e) {
    throw e
  }
}
