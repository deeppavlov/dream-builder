import React, { useEffect, useRef, useState } from 'react'
import DeepyHelperIcon from '@assets/icons/deepy_helper.png'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DialogMicrophoneIcon } from '@assets/icons/dialog_microphone.svg'
import DialogButton from '../DialogButton/DialogButton'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import SidePanel from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './HelperDialogSidePanel.module.scss'
import { useOnKey } from '../../hooks/useOnKey'
import { Message, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { sendMessage } from '../../services/sendMessage'
import TextLoader from '../TextLoader/TextLoader'
import { DialogSessionConfig } from '../DialogSidePanel/DialogSidePanel'
import dist from 'react-hot-toast'
import { renewDialog } from '../../services/renewDialog'
import { getHistory } from '../../services/getHistory'
import classNames from 'classnames/bind'

const TEXT_CHAT_TYPE = 'text'
const VOICE_CHAT_TYPE = 'voice'

type ChatType = typeof TEXT_CHAT_TYPE | typeof VOICE_CHAT_TYPE
// interface ChatMessage {
//   byBot: boolean
//   text: string
// }

interface Props {
  isOpen?: boolean
}
type FromForm = { message: string }
const HelperDialogSidePanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [chatType, setChatType] = useState<ChatType>(TEXT_CHAT_TYPE)
  const [chatHistory, setChatHistory] = useState<ChatMessage[] | []>([])
  const [message, setMessage] = useState<string>('')
  const [dialogSession, setDialogueSession] =
    useState<DialogSessionConfig | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const { handleSubmit, register, reset } = useForm()
  const handleTypeBtnClick = (type: ChatType) => setChatType(type)
  const cx = classNames.bind(s)

  const {
    data: history,
    isLoading: isHistoryLoading,
    isError: historyError,
  } = useQuery(
    ['history', dialogSession?.id],
    () => getHistory(dialogSession?.id!),
    { enabled: !!message }
  )
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
    setIsOpen(data.detail.isOpen ?? !isOpen)
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
  useEffect(() => {
    subscribe('HelperDialogSidePanel', handleTrigger)
    renew.mutateAsync('deepy_assistant')
    return () => unsubscribe('HelperDialogSidePanel', handleTrigger)
  }, [])
  const handleTextAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(handleSend)()
    }
  }
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatHistory])
  // useOnKey(handleSubmit(handleSend), 'Enter')
  return (
    <SidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={{ left: 80, right: 'auto', bottom: 0 }}
      withTransition={false}
      key={'HelperDialogSidePanel'}>
      <div className={s.container}>
        <div className={s.dialogSidePanel}>
          <SidePanelHeader>
            <span className={s.header}>
              <img src={DeepyHelperIcon} alt='Deepy' className={s.deepy} />
              Deepy
            </span>
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
                  <span className={`${s.chat__message} `}>{message}</span>
                </div>
                <div className={cx('chat__container_bot', 'chat__container')}>
                  <span className={cx('chat__message', 'chat__message_bot')}>
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

export default HelperDialogSidePanel
