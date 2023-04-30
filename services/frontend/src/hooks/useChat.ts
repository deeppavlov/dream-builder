import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import store from 'store2'
import { ChatHistory } from '../components/SkillDialog/SkillDialog'
import { DEEPY_ASSISTANT } from '../constants/constants'
import { useDisplay } from '../context/DisplayContext'
import { getHistory } from '../services/getHistory'
import { renewDialog } from '../services/renewDialog'
import { IPostChat, sendMessage } from '../services/sendMessage'
import { SessionConfig } from '../types/types'
import { consts } from '../utils/consts'
import { checkOpenAiType } from '../components/SkillPromptModal/SkillPromptModal'

export const useChat = () => {
  const [session, setSession] = useState<SessionConfig | null>(null)
  const [history, setHistory] = useState<ChatHistory[]>([])
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState(false)
  const [deepySession, setDeepySession] = useState(store('deepySession'))
  const [isDeepy, setIsDeepy] = useState<boolean>(Boolean(deepySession?.id))
  const { options } = useDisplay()

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
    onMutate: ({ text }: IPostChat) => {
      setMessage(text)
      setHistory(state => [...state, { text, author: 'me' }])
    },
    mutationFn: (variables: IPostChat) => {
      return sendMessage(variables)
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
