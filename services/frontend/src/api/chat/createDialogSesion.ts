import { SessionConfig } from 'types/types'
import { api } from 'api/axiosConfig'

export async function createDialogSession(
  name: string
): Promise<SessionConfig> {
  const pl = { virtual_assistant_name: name }
  try {
    const { data } = await api.post('dialog_sessions', { ...pl })
    return data
  } catch (e) {
    throw e
  }
}
