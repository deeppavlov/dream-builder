import { AxiosError } from 'axios'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import store from 'store2'
import { DEEPY_ASSISTANT } from '../constants/constants'
import { useDisplay } from '../context/DisplayContext'
import { getDialogSession } from '../services/getDialogSession'
import { getHistory } from '../services/getHistory'
import { renewDialog } from '../services/renewDialog'
import { sendMessage } from '../services/sendMessage'
import { IPostChat, SessionConfig } from '../types/types'
import { consts } from '../utils/consts'
import { ChatHistory } from './../types/types'

export const useChat = () => {
  const { options } = useDisplay()
  const queryClient = useQueryClient()
  const bot = options.get(consts.CHAT_SP_IS_ACTIVE)
  const [session, setSession] = useState<SessionConfig | null>(null)
  const [history, setHistory] = useState<ChatHistory[]>([])
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState(false)

  const [deepySession, setDeepySession] = useState<SessionConfig>(
    store('deepySession')
  )
  
  const [isDeepy, setIsDeepy] = useState<boolean>(
    Boolean(deepySession?.id) && options.get(consts.COPILOT_SP_IS_ACTIVE) //FIX!!!
  )

  const checkAvailableSession = useMutation({
    mutationFn: (data: number) => getDialogSession(data),
  })
  
  const renew = useMutation({
    onMutate: data => {
      store(data + '_session') ? store.remove(data + '_session') : null

      setMessage('')
      setHistory([])

      if (data === DEEPY_ASSISTANT) {
        store.remove('deepySession')
        setDeepySession(null!)
        setIsDeepy(true)
      }
    },
    mutationFn: (data: string) => renewDialog(data),
    onSuccess: (data, variables) => {
      async function updateDeepyAssistant() {
        setDeepySession(data)
        store('deepySession', data)
      }

      if (variables === DEEPY_ASSISTANT) {
        updateDeepyAssistant().then(() => {
          queryClient.invalidateQueries('history').then(() => {
            const id = data?.id
            queryClient.removeQueries('history')
            send.mutateAsync({
              dialog_session_id: id,
              text: 'hi deepy!',
              hidden: true,
            })
          })
        })
      } else {
        store(variables + '_session', data)
        setSession(data)
        remoteAssistantHistory.mutateAsync(data.id)
      }
    },
    onError: (_, variables) => {
      store.remove(variables + '_session')
    },
  })
  
  const send = useMutation({
    onMutate: ({ text, hidden }: IPostChat) => {
      setMessage(text)
      setHistory(state => [...state, { text, author: 'me', hidden: hidden }])
    },
    mutationFn: (variables: IPostChat) => sendMessage(variables),
    onSuccess: data => {
      setHistory(state => [
        ...state,
        { text: data?.text, author: 'bot', active_skill: data?.active_skill },
      ])
    },
    onError: (data: AxiosError, variables) => {
      isDeepy && renew.mutate(DEEPY_ASSISTANT) //FIX!!!
      // setError(true)
      if (data.response?.status === 404) {
        renew.mutateAsync(bot?.name)
      }
    },
  })
  const remoteAssistantHistory = useMutation({
    mutationFn: (data: number) => getHistory(data),
  })
  const remoteHistory = useQuery(
    'history',
    () => getHistory(deepySession?.id),
    {
      enabled:
        Boolean(deepySession?.id) && options.get(consts.COPILOT_SP_IS_ACTIVE),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  )

  return {
    deepySession,
    isDeepy,
    send,
    renew,
    session,
    history,
    message,
    error,
    remoteHistory,
    checkAvailableSession,
    setSession,
    remoteAssistantHistory,
  }
}
