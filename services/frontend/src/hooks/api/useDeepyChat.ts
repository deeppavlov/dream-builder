import { AxiosError } from 'axios'
import { useUIOptions } from 'context'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import store from 'store2'
import { ChatHistory, IPostChat, SessionConfig } from 'types/types'
import { DEEPY_ASSISTANT } from 'constants/constants'
import { createDialogSession, getHistory, sendMessage } from 'api/chat'
import { consts } from 'utils/consts'

export const useDeepyChat = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'sidepanels.deepy' })
  const { UIOptions } = useUIOptions()
  const queryClient = useQueryClient()
  const deepyActive = UIOptions[consts.COPILOT_SP_IS_ACTIVE]
  const [deepyHistory, setDeepyHistory] = useState<ChatHistory[]>([])
  const [deepyMessage, setDeepyMessage] = useState<string>('')
  const [deepySession, setDeepySession] = useState<SessionConfig>(
    store('deepySession')
  )
  const [isDeepy, setIsDeepy] = useState<boolean>(
    Boolean(deepySession?.id) && deepyActive //FIX!!!
  )

  const renewDeepySession = useMutation({
    onMutate: () => {
      setDeepyMessage('')
      setDeepyHistory([])
      store.remove('deepySession')
      setDeepySession(null!)
      setIsDeepy(true)
    },
    mutationFn: (data: string) => createDialogSession(data),
    onSuccess: data => {
      async function updateDeepyAssistant() {
        setDeepySession(data)
        store('deepySession', data)
      }
      updateDeepyAssistant().then(() =>
        queryClient.removeQueries('deepyHistory')
      )
    },
    onError: () => {
      store.remove('deepySession')
    },
  })

  const sendToDeepy = useMutation({
    onMutate: ({ text, hidden }: IPostChat) => {
      setDeepyMessage(text)
      setDeepyHistory(state => [
        ...state,
        { text, author: 'me', hidden: hidden },
      ])
    },
    mutationFn: (variables: IPostChat) => sendMessage(variables),
    onSuccess: data => {
      setDeepyHistory(state => [...state, { text: data?.text, author: 'bot' }])
    },
    onError: (data: AxiosError) => {
      data.response?.status === 404 &&
        renewDeepySession.mutateAsync(DEEPY_ASSISTANT)
    },
  })

  const deepyRemoteHistory = useQuery(
    'deepyHistory',
    () => getHistory(deepySession?.id),
    {
      enabled: deepyActive,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0,
      onError: () => {
        sendToDeepy.mutateAsync({
          dialog_session_id: deepySession?.id,
          text: t('first_msg_greeting'),
          hidden: true,
        })
      },
    }
  )

  return {
    isDeepy,
    sendToDeepy,
    deepyHistory,
    deepySession,
    deepyMessage,
    deepyRemoteHistory,
    renewDeepySession,
  }
}
