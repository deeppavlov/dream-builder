import { privateApi } from './axiosConfig'

export interface IPostChat {
  dialog_session_id: number
  text: string
  prompt?: string
  lm_service_id?: number
}

export async function sendMessage({
  dialog_session_id,
  text,
  prompt,
  lm_service_id,
}: IPostChat) {
  try {
    const { data } = await privateApi.post(
      `dialog_sessions/${dialog_session_id}/chat`,
      { text, prompt, lm_service_id }
    )

    return data
  } catch (e) {
    throw e
  }
}
