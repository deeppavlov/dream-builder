import { IPostChat } from 'types/types'
import { api } from 'api/axiosConfig'

export async function sendMessage({
  dialog_session_id,
  text,
  prompt,
  lm_service_id,
  openai_api_key,
}: IPostChat) {
  try {
    const { data } = await api.post(
      `dialog_sessions/${dialog_session_id}/chat`,
      { text, prompt, lm_service_id, openai_api_key }
    )
    return data
  } catch (e) {
    throw e
  }
}
