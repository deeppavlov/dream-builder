import { AxiosError } from 'axios'
import { useAuth, useUIOptions } from 'context'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import store from 'store2'
import { ChatHistory, IPostChat, SessionConfig } from 'types/types'
import { DEEPY_ASSISTANT, OPEN_AI_LM } from 'constants/constants'
import { createDialogSession, getHistory, sendMessage } from 'api/chat'
import { useGaDeepy } from 'hooks/googleAnalytics/useGaDeepy'
import { consts } from 'utils/consts'
import { getLSApiKeyByName } from 'utils/getLSApiKeys'

export const useDeepyChat = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'sidepanels.deepy' })
  const { UIOptions } = useUIOptions()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const deepyActive = UIOptions[consts.COPILOT_SP_IS_ACTIVE]
  const [deepyHistory, setDeepyHistory] = useState<ChatHistory[]>([])
  const [deepyMessage, setDeepyMessage] = useState<string>('')
  const [deepySession, setDeepySession] = useState<SessionConfig>(
    store('deepySession')
  )
  const [isDeepy, setIsDeepy] = useState<boolean>(
    Boolean(deepySession?.id) && deepyActive //FIX!!!
  )
  const { deepyChatSend, deepyChatRefresh } = useGaDeepy()

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
      deepyChatRefresh()
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
    mutationFn: (variables: IPostChat) => {
      const openaiApiKey =
        getLSApiKeyByName(user?.id!, OPEN_AI_LM, true) || undefined

      return sendMessage({ ...variables, openai_api_key: openaiApiKey })
    },
    onSuccess: data => {
      const localSession = store('deepySession', data)
      store('deepySession', {
        ...localSession,
        dummy: data.active_skill.name === 'dummy_skill',
      })

      deepyChatSend(deepyHistory.length)
      setDeepyHistory(state => [
        ...state,
        { text: data?.text, author: 'bot', active_skill: data.active_skill },
      ])
    },
    onError: (data: AxiosError) => {
      const needToRenew =
        data.response?.status === 404 || data.response?.status === 403
      needToRenew && renewDeepySession.mutateAsync(DEEPY_ASSISTANT)
    },
  })

  const deepyRemoteHistory = useQuery(
    'deepyHistory',
    () => getHistory(deepySession?.id),
    {
      initialData: [],
      enabled: deepyActive,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0,
      onError: () => {
        setDeepyHistory([])
        sendToDeepy.mutateAsync({
          dialog_session_id: deepySession?.id,
          text: t('first_msg_greeting'),
          hidden: true,
        })
      },
      onSuccess: data => {
        setDeepyHistory(data)
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
