import DeepyHelperIcon from '@assets/icons/deepy_helper.png'
import classNames from 'classnames/bind'
import React,{ useEffect,useRef } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { DEEPY_ASSISTANT } from '../../constants/constants'
import { useDisplay } from '../../context/DisplayContext'
import { useChat } from '../../hooks/useChat'
import { useChatScroll } from '../../hooks/useChatScroll'
import { ChatForm } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { сopyToClipboard } from '../../utils/copyToClipboard'
import { submitOnEnter } from '../../utils/submitOnEnter'
import { validationSchema } from '../../utils/validationSchema'
import { ChatHistory } from '../SkillDialog/SkillDialog'
import TextLoader from '../TextLoader/TextLoader'
import { ToastCopySucces } from '../Toasts/Toasts'
import s from './CopilotSidePanel.module.scss'

export const CopilotSidePanel = () => {
  const {
    remoteHistory,
    send,
    renew,
    isDeepy,
    session,
    message,
    history,
    deepySession,
  } = useChat()
  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const { dispatch, options } = useDisplay()
  const isOpen = options.get('COPILOT_SP_IS_ACTIVE')
  const chatRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLSpanElement>(null)
  const cx = classNames.bind(s)

  // handlers
  const handleMessageClick = () => {
    сopyToClipboard(messageRef)
    toast.custom(<ToastCopySucces />, {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))
  }

  console.log('remotehistory = ', remoteHistory)
  
  const handleSend = (data: ChatForm) => {
    const id = deepySession?.id! || session?.id
    const message = data?.message
    send.mutate({ id, message })
    reset()
  }

  // hooks
  useEffect(() => {
    console.log('isDeepy = ', isDeepy)
    !isDeepy && renew.mutateAsync(DEEPY_ASSISTANT)
  }, [])

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
          {history?.map((block: ChatHistory, i: number) => (
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
          ))}
          {send?.isLoading && (
            <>
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
        {/* <div className={s.dialogSidePanel__controls}>
          <DialogButton active={true}>
            <DialogTextIcon />
          </DialogButton>
          <DialogButton active={false}>
            <DialogMicrophoneIcon />
          </DialogButton>
        </div> */}
        <form onSubmit={handleSubmit(handleSend)}>
          <textarea
            onKeyDown={handleKeyDown}
            className={s.dialogSidePanel__textarea}
            placeholder='Type...'
            {...register('message', {
              required: validationSchema.global.required,
            })}
          />
          <input type='submit' hidden />
          <SidePanelButtons>
            <Button
              theme='primary'
              props={{
                disabled: send?.isLoading,
                type: 'submit',
              }}
            >
              Send
            </Button>
          </SidePanelButtons>
        </form>
      </div>
    </div>
  )
}
