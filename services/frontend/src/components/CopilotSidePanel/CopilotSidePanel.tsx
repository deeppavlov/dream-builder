import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import classNames from 'classnames/bind'
import toast from 'react-hot-toast'
import DeepyHelperIcon from '@assets/icons/deepy_helper.png'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DialogMicrophoneIcon } from '@assets/icons/dialog_microphone.svg'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import { sendMessage } from '../../services/sendMessage'
import { renewDialog } from '../../services/renewDialog'
import { getHistory } from '../../services/getHistory'
import { ToastCopySucces } from '../Toasts/Toasts'
import { SessionConfig } from '../DialogSidePanel/DialogSidePanel'
import { useDisplay } from '../../context/DisplayContext'
import { useChatScroll } from '../../hooks/useChatScroll'
import { useOnlyOnMount } from '../../hooks/useOnMount'
import { ChatForm } from '../../types/types'
import { consts } from '../../utils/consts'
import { submitOnEnter } from '../../utils/submitOnEnter'
import DialogButton from '../DialogButton/DialogButton'
import TextLoader from '../TextLoader/TextLoader'
import s from './CopilotSidePanel.module.scss'

export const DEEPY_ASSISTANT = 'deepy_assistant'
const TEXT_CHAT_TYPE = 'text'
const VOICE_CHAT_TYPE = 'voice'

type ChatType = typeof TEXT_CHAT_TYPE | typeof VOICE_CHAT_TYPE

const CopilotSidePanel = () => {
  const [chatType, setChatType] = useState<ChatType>(TEXT_CHAT_TYPE)
  const [message, setMessage] = useState<string>('')
  const [session, setSession] = useState<SessionConfig | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLSpanElement>(null)
  const queryClient = useQueryClient()
  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const { dispatch } = useDisplay()
  const cx = classNames.bind(s)
  // handlers
  const handleMessageClick = () => {
    navigator.clipboard.writeText(messageRef?.current?.textContent!)
    toast.custom(<ToastCopySucces />, {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }

  const handleTypeBtnClick = (type: ChatType) => setChatType(type)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))
  }

  const handleSend = (data: ChatForm) => {
    const id = session?.id!
    const message = data?.message!
    setMessage(message)
    send.mutate({ id, message })
    reset()
  }
  // queries
  const renew = useMutation({
    mutationFn: (data: string) => {
      return renewDialog(data)
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: 'history' }), setSession(data)
    },
  })
  const send = useMutation({
    mutationFn: (variables: { id: number; message: string }) => {
      return sendMessage(variables?.id, variables?.message)
    },
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: 'history' }),
  })
  const { data: history } = useQuery(
    ['history', session?.id],
    () => getHistory(session?.id!),
    { refetchOnWindowFocus: false, enabled: send?.isLoading }
  )
  // hooks
  useOnlyOnMount(() => renew.mutateAsync(DEEPY_ASSISTANT))
  useChatScroll(chatRef, [history, message])

  const dispatchTrigger = (isOpen: boolean) =>
    dispatch({
      type: 'set',
      option: {
        id: consts.COPILOT_SP_IS_ACTIVE,
        value: isOpen,
      },
    })

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])

  return (
    <div className={s.container}>
      <div className={s.dialogSidePanel}>
        <SidePanelHeader>
          <span className={s.header}>
            <img src={DeepyHelperIcon} alt='Deepy' className={s.deepy} />
            Deepy
          </span>
        </SidePanelHeader>
        <div className={s.chat} ref={chatRef}>
          {history &&
            history?.map(
              (block: { author: string; text: string }, i: number) => (
                <div
                  key={`${block?.author == 'bot'}${i}`}
                  className={cx(
                    'chat__container',
                    block?.author == 'bot' && 'chat__container_bot'
                  )}
                >
                  <span
                    ref={messageRef}
                    onClick={handleMessageClick}
                    className={cx(
                      'chat__message',
                      block?.author == 'bot' && 'chat__message_bot'
                    )}
                  >
                    {block?.text}
                  </span>
                </div>
              )
            )}
          {send?.isLoading && (
            <>
              <div className={cx('chat__container')}>
                <span
                  onClick={handleMessageClick}
                  className={cx('chat__message')}
                >
                  {message}
                </span>
              </div>
              <div className={cx('chat__container', 'chat__container_bot')}>
                <span
                  onClick={handleMessageClick}
                  className={cx('chat__message', 'chat__message_bot')}
                >
                  <TextLoader />
                </span>
              </div>
            </>
          )}
        </div>
        <div className={s.dialogSidePanel__controls}>
          <DialogButton
            active={chatType === 'text'}
            onClick={() => handleTypeBtnClick(TEXT_CHAT_TYPE)}
          >
            <DialogTextIcon />
          </DialogButton>
          <DialogButton active={chatType === 'voice'}>
            <DialogMicrophoneIcon />
          </DialogButton>
        </div>
        <form onSubmit={handleSubmit(handleSend)}>
          <textarea
            onKeyDown={handleKeyDown}
            className={s.dialogSidePanel__textarea}
            placeholder='Type...'
            {...register('message')}
          />
          <input type='submit' hidden />
          <SidePanelButtons>
            <Button theme='primary' props={{ type: 'submit' }}>
              Send
            </Button>
          </SidePanelButtons>
        </form>
      </div>
    </div>
  )
}

export default CopilotSidePanel
