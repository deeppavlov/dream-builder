import { useState } from 'react'
import { useMutation,useQuery,useQueryClient } from 'react-query'
import store from 'store2'
import { DEEPY_ASSISTANT } from '../constants/constants'
import { useDisplay } from '../context/DisplayContext'
import { getHistory } from '../services/getHistory'
import { renewDialog } from '../services/renewDialog'
import { sendMessage } from '../services/sendMessage'
import { ChatHistory,IPostChat,SessionConfig } from '../types/types'
import { consts } from '../utils/consts'

export const useChat = () => {
  const [session, setSession] = useState<SessionConfig | null>(null)
  const [history, setHistory] = useState<ChatHistory[]>([])
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState(false)
  const [deepySession, setDeepySession] = useState<SessionConfig>(
    store('deepySession')
  )
  const [isDeepy, setIsDeepy] = useState<boolean>(Boolean(deepySession?.id))
  const { options } = useDisplay()
  const queryClient = useQueryClient()
  const renew = useMutation({
    onMutate: (data: string) => {
      setMessage('')
      setHistory([])
      data === DEEPY_ASSISTANT && store.remove('deepySession')
      data === DEEPY_ASSISTANT && setIsDeepy(true)
      data === DEEPY_ASSISTANT && setDeepySession(null)
    },
    mutationFn: (data: string) => {
      return renewDialog(data)
    },
    onSuccess: (data, variables) => {
      variables == DEEPY_ASSISTANT ? setDeepySession(data) : setSession(data)
      variables == DEEPY_ASSISTANT && store('deepySession', data)
      variables == DEEPY_ASSISTANT &&
        queryClient.invalidateQueries('history').then(() => {
          send.mutateAsync({
            dialog_session_id: deepySession?.id,
            text: 'hi deepy!',
            hidden: true,
          })
        })
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
    onError: () => {
      renew.mutate(DEEPY_ASSISTANT) //FIX!!!
      setError(true)
    },
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
  }
}
