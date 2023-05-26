import { AxiosError } from 'axios'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import store from 'store2'
import { DEEPY_ASSISTANT } from '../constants/constants'
import { useDisplay } from '../context/DisplayContext'
import { getHistory } from '../services/getHistory'
import { renewDialog } from '../services/renewDialog'
import { sendMessage } from '../services/sendMessage'
import { ChatHistory, IPostChat, SessionConfig } from '../types/types'
import { consts } from '../utils/consts'

export const useDeepyChat = () => {
  const { options } = useDisplay()
  const queryClient = useQueryClient()
  const deepyActive = options.get(consts.COPILOT_SP_IS_ACTIVE)
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
    mutationFn: (data: string) => renewDialog(data),
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
          text: 'hi deepy!',
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
