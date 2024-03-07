import { AxiosError } from 'axios'
import { useUIOptions } from 'context'
import { useRef, useState } from 'react'
import { useMutation } from 'react-query'
import store from 'store2'
import { ChatHistory, IPostChat, SessionConfig } from 'types/types'
import { DEBUG_EN_DIST, DEBUG_RU_DIST } from 'constants/constants'
import { createDialogSession, getHistory, sendMessage } from 'api/chat'
import { consts } from 'utils/consts'

export const useChat = () => {
  const { UIOptions } = useUIOptions()
  const bot = UIOptions[consts.CHAT_SP_IS_ACTIVE]
  const [session, setSession] = useState<SessionConfig | null>(null)
  const [history, setHistory] = useState<ChatHistory[]>([])
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<boolean>(false)

  const [showNetworkIssue, setShowNetworkIssue] = useState(false)
  const networkIssueTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // const checkAvailableSession = useMutation({
  //   mutationFn: (data: number) => getDialogSession(data),
  //   onSuccess: data => console.log('data = ', data),
  // })

  const renew = useMutation({
    onMutate: data => {
      store(data + '_session') ? store.remove(data + '_session') : null
      setMessage('')
      setHistory([])
    },
    mutationFn: (data: string) => createDialogSession(data),
    onSuccess: (data, variables) => {
      setShowNetworkIssue(false)
      const isDebug = variables === DEBUG_EN_DIST || variables === DEBUG_RU_DIST
      const localStorageSessionName = data.user_id
        ? `${variables}_session_${data.user_id}`
        : `${variables}_session`
      !isDebug && store(localStorageSessionName, data)
      setSession(data)
      !isDebug && remoteHistory.mutateAsync(data.id)
    },
    onError: (_, variables) => store.remove(variables + '_session'),
  })

  const send = useMutation({
    onMutate: ({ text }: IPostChat) => {
      const timeout = setTimeout(() => {
        setShowNetworkIssue(true)
      }, 20000)
      networkIssueTimeoutRef.current = timeout

      setMessage(text)
      setHistory(state => [...state, { text, author: 'me' }])
    },
    mutationFn: (variables: IPostChat) => sendMessage(variables),
    onSuccess: data => {
      setHistory(state => [
        ...state,
        { text: data?.text, author: 'bot', active_skill: data?.active_skill },
      ])
    },
    onError: (data: AxiosError) => {
      setHistory(state => state.slice(0, -1))
      const needToRenew =
        data.response?.status === 404 || data.response?.status === 403
      needToRenew && renew.mutateAsync(bot?.name)
    },
    onSettled: () => {
      if (networkIssueTimeoutRef.current) {
        clearTimeout(networkIssueTimeoutRef.current)
        networkIssueTimeoutRef.current = null
        setShowNetworkIssue(false)
      }
    },
  })

  const remoteHistory = useMutation({
    mutationFn: (data: number) => getHistory(data),
    onSuccess: data => {
      setHistory(data)
    },
  })

  return {
    send,
    renew,
    message,
    history,
    session,
    setSession,
    remoteHistory,
    error,
    showNetworkIssue,
  }
}
