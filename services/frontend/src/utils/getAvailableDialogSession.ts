import store from 'store2'
import { SessionConfig } from 'types/types'

export const getAvailableDialogSession = (
  assistantName: string,
  userId?: number
): SessionConfig => {
  return userId
    ? store(`${assistantName}_session_${userId}`)
    : store(`${assistantName}_session`)
}
