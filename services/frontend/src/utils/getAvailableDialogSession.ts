import store from 'store2'
import { SessionConfig } from 'types/types'

export const getAvailableDialogSession = (
  assistantName: string
): SessionConfig => {
  return store(assistantName + '_session')
}
