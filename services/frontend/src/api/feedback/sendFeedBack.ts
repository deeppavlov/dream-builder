import { IFeedback } from 'types/types'
import { apiFeedback } from 'api/axiosConfig'

export async function sendFeedBack(params: IFeedback) {
  try {
    const { data } = await apiFeedback.post(`/feedback`, { ...params })
    return data
  } catch (e) {
    throw e
  }
}
