import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import store from 'store2'
import { ChatHistory } from '../components/SkillDialog/SkillDialog'
import { DEEPY_ASSISTANT } from '../constants/constants'
import { getHistory } from '../services/getHistory'
import { renewDialog } from '../services/renewDialog'
import { sendMessage } from '../services/sendMessage'
import { SessionConfig } from '../types/types'

export const useChat = () => {
  const [session, setSession] = useState<SessionConfig | null>(null)
  const [history, setHistory] = useState<ChatHistory[]>([])
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState(false)
  const [deepySession, setDeepySession] = useState(store('deepySession'))
  const [isDeepy, setIsDeepy] = useState<boolean>(Boolean(deepySession?.id))

  isDeepy && session?.id && store('deepyID', session)

  const renew = useMutation({
    onMutate: (data: string) => {
      setMessage('')
      setHistory([])
      data === DEEPY_ASSISTANT && setIsDeepy(true)
    },
    mutationFn: (data: string) => {
      return renewDialog(data)
    },
    onSuccess: (data, variables) => {
      variables == DEEPY_ASSISTANT ? setDeepySession(data) : setSession(data)
      variables == DEEPY_ASSISTANT && store('deepySession', data)
    },
  })

  const send = useMutation({
    onMutate: variables => {
      setMessage(variables.message)
      setHistory(state => [...state, { text: variables.message, author: 'me' }])
    },
    mutationFn: (variables: { id: number; message: string }) => {
      return sendMessage(variables?.id, variables?.message)
    },
    onSuccess: data => {
      // queryClient.invalidateQueries('history')
      setHistory(state => [...state, { text: data?.text, author: 'bot' }])
    },
    onError: () => {
      setError(true)
    },
  })

  const remoteHistory = useQuery(
    'history',
    () => getHistory(isDeepy ? deepySession.id : session?.id),
    {
      enabled: Boolean(deepySession?.id),
      refetchOnMount: true,
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
