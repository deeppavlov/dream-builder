import { SessionConfig } from 'types/types'
import { api } from 'api/axiosConfig'

export async function getDialogSession(
  dialog_session_id: number
): Promise<SessionConfig> {
  try {
    const { data } = await api.get(`dialog_sessions/${dialog_session_id}`)
    return data
  } catch (e) {
    throw e
  }
}
