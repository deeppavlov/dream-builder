import { IFeedbackStatus } from 'types/types'
import { apiFeedback } from 'api/axiosConfig'

export const getFeedbackStatuses = async (): Promise<IFeedbackStatus[]> => {
  try {
    const { data } = await apiFeedback.get(`/feedback/status/all`)
    return data
  } catch (e) {
    throw e
  }
}
