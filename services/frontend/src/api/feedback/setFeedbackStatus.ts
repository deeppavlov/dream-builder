import { IFeedback } from 'types/types'
import { apiFeedback } from 'api/axiosConfig'

export const setFeedbackStatus = async (
  feedback_id: number,
  status_id: number
): Promise<IFeedback> => {
  try {
    const url = `/feedback/${feedback_id}/status?status_id=${status_id}`

    const { data } = await apiFeedback.patch(url)
    return data
  } catch (e) {
    throw e
  }
}
