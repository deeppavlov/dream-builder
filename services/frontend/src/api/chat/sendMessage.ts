import { IPostChat } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export async function sendMessage({
  dialog_session_id,
  text,
  prompt,
  lm_service_id,
  apiKeys,
}: IPostChat) {
  try {
    const { data } = await privateApi.post(
      `dialog_sessions/${dialog_session_id}/chat`,
      { text, prompt, lm_service_id, ...apiKeys }
    )
    return data
  } catch (e) {
    throw e
  }
}
