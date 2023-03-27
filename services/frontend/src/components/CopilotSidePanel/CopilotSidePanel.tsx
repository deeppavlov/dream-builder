import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import DeepyHelperIcon from '@assets/icons/deepy_helper.png'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DialogMicrophoneIcon } from '@assets/icons/dialog_microphone.svg'
import DialogButton from '../DialogButton/DialogButton'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import SidePanel from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import { trigger } from '../../utils/events'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { sendMessage } from '../../services/sendMessage'
import TextLoader from '../TextLoader/TextLoader'
import { SessionConfig } from '../DialogSidePanel/DialogSidePanel'
import { renewDialog } from '../../services/renewDialog'
import { getHistory } from '../../services/getHistory'
import classNames from 'classnames/bind'
import toast from 'react-hot-toast'
import { ToastCopySucces } from '../Toasts/Toasts'
import { useObserver } from '../../hooks/useObserver'
import s from './CopilotSidePanel.module.scss'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'

export const COPILOT_SP_TRIGGER = 'COPILOT_SP_TRIGGER'

const TEXT_CHAT_TYPE = 'text'
const VOICE_CHAT_TYPE = 'voice'

type ChatType = typeof TEXT_CHAT_TYPE | typeof VOICE_CHAT_TYPE

interface Props {
  isOpen?: boolean
}
type FromForm = { message: string }
const CopilotSidePanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [chatType, setChatType] = useState<ChatType>(TEXT_CHAT_TYPE)
  const [chatHistory, setChatHistory] = useState<ChatMessage[] | []>([])
  const [message, setMessage] = useState<string>('')
  const [dialogSession, setDialogueSession] = useState<SessionConfig | null>(
    null
  )
  const chatRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const { handleSubmit, register, reset } = useForm()
  const ref = useRef<HTMLSpanElement>()
  const {
    data: history,
    isLoading: isHistoryLoading,
    isError: historyError,
  } = useQuery(
    ['history', dialogSession?.id],
    () => getHistory(dialogSession?.id!),
    { enabled: !!message }
  )
  const { dispatch } = useDisplay()
  const cx = classNames.bind(s)

  const handleMessageClick = () => {
    navigator.clipboard.writeText(ref?.current?.textContent!)
    toast.custom(<ToastCopySucces />, {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    trigger(COPILOT_SP_TRIGGER, { isOpen: false })
  }

  const handleTypeBtnClick = (type: ChatType) => setChatType(type)

  const renew = useMutation({
    mutationFn: (data: string) => {
      return renewDialog(data)
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: 'history' }),
        setDialogueSession(data)
    },
  })

  const handleTrigger = (data: { detail: Props }) => {
    setIsOpen(prev => {
      const state = data.detail?.isOpen ?? !prev

      trigger(COPILOT_SP_TRIGGER, { isOpen: state })
      return state
    })
  }

  const handleSend = (data: FromForm) => {
    const id = dialogSession?.id!
    const message = data?.message!
    setMessage(message)
    send.mutate({ id, message })
    reset()
  }

  const send = useMutation({
    mutationFn: (variables: { id: number; message: string }) => {
      return sendMessage(variables?.id, variables?.message)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: 'history' }),
  })

  const handleTextAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(handleSend)()
    }
  }

  useObserver(COPILOT_SP_TRIGGER, handleTrigger)

  useEffect(() => {
    renew.mutateAsync('deepy_assistant')
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    dispatch({
      type: 'set',
      option: {
        id: consts.LEFT_SIDEPANEL_IS_ACTIVE,
        value: isOpen,
      },
    })
  }, [isOpen])

  return (
    <SidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleClose={handleClose}
      position={{ left: 80, right: 'auto', bottom: 0 }}
      transition='left'
      key={COPILOT_SP_TRIGGER}>
      <div className={s.container}>
        <div className={s.dialogSidePanel}>
          <SidePanelHeader>
            <span className={s.header}>
              <img src={DeepyHelperIcon} alt='Deepy' className={s.deepy} />
              Deepy
            </span>
            <button className={s.close} onClick={handleClose}>
              <CloseIcon />
            </button>
          </SidePanelHeader>
          <div className={s.chat}>
            {history &&
              history?.map((block, i: number) => (
                <div
                  key={`${block?.author == 'bot'}${i}`}
                  className={cx(
                    'chat__container',
                    block?.author == 'bot' && 'chat__container_bot'
                  )}>
                  <span
                    ref={ref}
                    onClick={handleMessageClick}
                    className={cx(
                      'chat__message',
                      block?.author == 'bot' && 'chat__message_bot'
                    )}>
                    {block?.text}
                  </span>
                </div>
              ))}
            {send?.isLoading && (
              <>
                <div className={`${s.chat__container}`}>
                  <span
                    onClick={handleMessageClick}
                    className={`${s.chat__message} `}>
                    {message}
                  </span>
                </div>
                <div className={cx('chat__container_bot', 'chat__container')}>
                  <span
                    onClick={handleMessageClick}
                    className={cx('chat__message', 'chat__message_bot')}>
                    <TextLoader />
                  </span>
                </div>
              </>
            )}
          </div>
          <div className={s.dialogSidePanel__controls}>
            <DialogButton
              active={chatType === 'text'}
              onClick={() => handleTypeBtnClick(TEXT_CHAT_TYPE)}>
              <DialogTextIcon />
            </DialogButton>
            <DialogButton active={chatType === 'voice'}>
              <DialogMicrophoneIcon />
            </DialogButton>
          </div>
          <form onSubmit={handleSubmit(handleSend)}>
            <textarea
              onKeyDown={handleTextAreaKeyDown}
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
    </SidePanel>
  )
}

export default CopilotSidePanel
