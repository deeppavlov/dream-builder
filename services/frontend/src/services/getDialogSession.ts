import { SessionConfig } from '../types/types'
import { privateApi } from './axiosConfig'

export async function getDialogSession(
  dialog_session_id: number
): Promise<SessionConfig> {
  console.log('get session')
  try {
    const { data } = await privateApi.get(
      `dialog_sessions/${dialog_session_id}`
    )
    return data
  } catch (e) {
    throw e
  }
}
