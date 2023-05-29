import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import classNames from 'classnames/bind'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DeepyHelperIcon from '../../assets/icons/deeppavlov_logo_round.svg'
import { DEEPY_ASSISTANT, TOOLTIP_DELAY } from '../../constants/constants'
import { useUIOptions } from '../../context/UIOptionsContext'
import { useChatScroll } from '../../hooks/useChatScroll'
import { useDeepyChat } from '../../hooks/useDeepyChat'
import { ChatForm, ChatHistory } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { сopyToClipboard } from '../../utils/copyToClipboard'
import { submitOnEnter } from '../../utils/submitOnEnter'
import { validationSchema } from '../../utils/validationSchema'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { Loader } from '../Loader/Loader'
import TextLoader from '../TextLoader/TextLoader'
import { ToastCopySucces } from '../Toasts/Toasts'
import s from './CopilotSidePanel.module.scss'

export const CopilotSidePanel = () => {
  const {
    sendToDeepy,
    deepyMessage,
    deepyHistory,
    deepySession,
    deepyRemoteHistory,
    renewDeepySession,
  } = useDeepyChat()

  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const { setUIOption } = useUIOptions()
  const cx = classNames.bind(s)
  const chatRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLSpanElement>(null)

  const sendDisabled = sendToDeepy?.isLoading || deepyRemoteHistory?.isLoading
  const renewDisabled = renewDeepySession?.isLoading || sendToDeepy?.isLoading

  const historyLoaderActive =
    deepyRemoteHistory?.isLoading && !deepyRemoteHistory?.error
  const textLoaderActive =
    sendToDeepy?.isLoading && !deepyRemoteHistory.isLoading

  // handlers
  const handleMessageClick = () => {
    сopyToClipboard(messageRef)
    toast.custom(<ToastCopySucces />, {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }
  const handleRenewClick = () => {
    renewDeepySession.mutateAsync(DEEPY_ASSISTANT)
  }

  const handleSend = (data: ChatForm) => {
    const payload = { dialog_session_id: deepySession?.id, text: data?.message }
    sendToDeepy.mutateAsync(payload)
    reset()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !sendToDeepy?.isLoading, handleSubmit(handleSend))
  }

  // hooks
  const dispatchTrigger = (isOpen: boolean) =>
    setUIOption({
      name: consts.COPILOT_SP_IS_ACTIVE,
      value: isOpen,
    })

  useEffect(() => {
    !deepySession?.id && renewDeepySession.mutateAsync(DEEPY_ASSISTANT) // getSession if it doesnt exist
  }, [])

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])

  useChatScroll(chatRef, [deepyRemoteHistory?.data, deepyMessage])

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
          {historyLoaderActive ? (
            <div className={s.loaderWrapper}>
              <Loader />
            </div>
          ) : (
            deepyRemoteHistory?.data?.map((block: ChatHistory, i: number) => {
              if (i > 0)
                return (
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
            })
          )}
          {deepyHistory?.map((block: ChatHistory, i: number) => (
            <div
              key={`${block?.author == 'bot'}${i}`}
              className={cx(
                'chat__container',
                block?.author == 'bot' && 'chat__container_bot'
              )}
            >
              <span
                style={{ display: block?.hidden ? 'none' : ' ' }}
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
          {textLoaderActive && (
            <div className={cx('chat__container', 'chat__container_bot')}>
              <span
                onClick={handleMessageClick}
                className={cx('chat__message', 'chat__message_bot')}
              >
                <TextLoader />
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(handleSend)}>
          <textarea
            onKeyDown={handleKeyDown}
            className={s.textarea}
            placeholder='Type...'
            {...register('message', {
              required: validationSchema.global.required,
            })}
          />
          <input type='submit' hidden />
          <SidePanelButtons>
            <Button
              theme='secondary'
              props={{
                disabled: renewDisabled,
                onClick: handleRenewClick,
              }}
            >
              <BaseToolTip
                delayShow={TOOLTIP_DELAY}
                id='renew'
                content='Restart Dialog'
              />
              <Renew data-tooltip-id='renew' />
            </Button>
            <Button
              theme='primary'
              props={{
                disabled: sendDisabled,
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
