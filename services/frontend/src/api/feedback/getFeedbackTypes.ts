import { IFeedbackType } from 'types/types'
import { apiFeedback } from 'api/axiosConfig'

export const getFeedbackTypes = async (): Promise<IFeedbackType[]> => {
  try {
    const { data } = await apiFeedback.get(`/feedback/type/all`)
    return data
  } catch (e) {
    throw e
  }
}
