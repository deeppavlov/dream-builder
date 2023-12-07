import { SessionConfig } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export async function createDialogSession(
  name: string
): Promise<SessionConfig> {
  const pl = { virtual_assistant_name: name }
  try {
    const { data } = await privateApi.post('dialog_sessions', { ...pl })
    return data
  } catch (e) {
    throw e
  }
}
