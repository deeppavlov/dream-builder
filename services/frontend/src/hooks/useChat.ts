import { useState } from 'react'
import { useMutation } from 'react-query'
import { ChatHistory } from '../components/SkillDialog/SkillDialog'
import { renewDialog } from '../services/renewDialog'
import { sendMessage } from '../services/sendMessage'
import { SessionConfig } from '../types/types'

export const useChat = () => {
  const [session, setSession] = useState<SessionConfig | null>(null)
  const [history, setHistory] = useState<ChatHistory[]>([])
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState(false)
  const renew = useMutation({
    onMutate: () => {
      setMessage('')
      setHistory([])
    },
    mutationFn: (data: string) => {
      return renewDialog(data)
    },
    onSuccess: data => {
      setSession(data)
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
      setHistory(state => [...state, { text: data?.text, author: 'bot' }])
    },
    onError: () => {
      setError(true)
    },
  })
  return { send, renew, session, history, message, error }
}
