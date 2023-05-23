import { ICreateComponent } from './../types/types'
import { privateApi } from './axiosConfig'

export async function createComponent(info: ICreateComponent) {
  try {
    const { data } = await privateApi.post(`/components`, {
      ...info,
    })
    return data
  } catch (e) {
    throw e
  }
}
