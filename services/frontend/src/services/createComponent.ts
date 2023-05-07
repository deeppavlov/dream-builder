import { PostDistParams } from './../types/types'
import { privateApi } from './axiosConfig'

export interface InfoForNewComponent extends PostDistParams {
  lm_service_id: number
  prompt: string
}

export async function createComponent(info: InfoForNewComponent) {
  try {
    const { data } = await privateApi.post(`/components`, {
      ...info,
    })
    return data
  } catch (e) {
    throw e
  }
}
