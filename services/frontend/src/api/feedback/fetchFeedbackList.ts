import { IFeedback } from 'types/types'
import { apiFeedback } from 'api/axiosConfig'

export const fetchFeedbackList = async (
  type_id: number | null = null,
  status_id: number | null = null
): Promise<IFeedback[]> => {
  try {
    const params = new URLSearchParams()
    type_id !== null && params.append('type_id', type_id.toString())
    status_id !== null && params.append('status_id', status_id.toString())

    const queryString = params.toString()
    const url = `/feedback${queryString ? `?${queryString}` : ''}`

    const { data } = await apiFeedback.get(url)
    return data
  } catch (e) {
    throw e
  }
}
