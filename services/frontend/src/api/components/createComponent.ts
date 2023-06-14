import { ICreateComponent } from 'types/types'
import { privateApi } from 'api/axiosConfig'

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
