import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
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
  const [deepySession, setDeepySession] = useState(
    JSON.parse(localStorage.getItem('deepyID'))
  )
  const [isDeepy, setIsDeepy] = useState<boolean>(Boolean(deepySession?.id))
  const queryClient = useQueryClient()
  const { data: remoteHistory } = useQuery('history', () =>
    getHistory(isDeepy ? deepySession.id : session?.id)
  )

  isDeepy &&
    session?.id &&
    localStorage.setItem('deepyID', JSON.stringify(session))
  console.log('isDeepy = ', isDeepy)
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
      variables == DEEPY_ASSISTANT &&
        localStorage.setItem('deepySession', JSON.stringify(data))
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
      queryClient.invalidateQueries('history')
      setHistory(state => [...state, { text: data?.text, author: 'bot' }])
    },
    onError: () => {
      setError(true)
    },
  })
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
