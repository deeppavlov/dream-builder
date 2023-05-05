import { PostDistParams } from '../types/types'
import { privateApi } from './axiosConfig'

export interface ComponentData extends PostDistParams { }

export async function editComponent(
  newData: ComponentData,
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
