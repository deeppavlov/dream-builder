import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import DeepyHelperIcon from 'assets/icons/deeppavlov_logo_round.svg'
import { ReactComponent as Renew } from 'assets/icons/renew.svg'
import { ChatForm, ChatHistory } from 'types/types'
import { DEEPY_ASSISTANT, TOOLTIP_DELAY } from 'constants/constants'
import { useDeepyChat } from 'hooks/api'
import { useChatScroll } from 'hooks/useChatScroll'
import { consts } from 'utils/consts'
import { сopyToClipboard } from 'utils/copyToClipboard'
import { submitOnEnter } from 'utils/submitOnEnter'
import { Button } from 'components/Buttons'
import { Loader, TextLoader } from 'components/Loaders'
import { BaseToolTip } from 'components/Menus'
import { SidePanelButtons, SidePanelHeader } from 'components/Panels'
import { ToastCopySucces } from 'components/UI'
import s from './CopilotSidePanel.module.scss'

export const CopilotSidePanel = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'sidepanels.deepy' })
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

  const sendDisabled = sendToDeepy?.isLoading || deepyRemoteHistory?.isLoading
  const renewDisabled = renewDeepySession?.isLoading || sendToDeepy?.isLoading

  const historyLoaderActive =
    deepyRemoteHistory?.isLoading && !deepyRemoteHistory?.error
  const textLoaderActive =
    sendToDeepy?.isLoading && !deepyRemoteHistory.isLoading

  // handlers
  const handleMessageClick = (message: string) => {
    сopyToClipboard(message)
    toast.custom(t => (t.visible ? <ToastCopySucces /> : null), {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }
  const handleRenewClick = () => {
    renewDeepySession.mutateAsync(DEEPY_ASSISTANT)
  }

  const handleSend = (data: ChatForm) => {
    const isMessage = data?.message.replace(/\s/g, '').length > 0
    if (!isMessage) return

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
            deepyHistory.map((block: ChatHistory, i: number) => {
              if (i > 0) {
                return (
                  <div
                    key={`${block?.author == 'bot'}${i}`}
                    className={cx(
                      block?.author == 'bot' ? 'botContainer' : 'userContainer',
                      block?.hidden && 'hidden'
                    )}
                  >
                    <span
                      onClick={() => handleMessageClick(block?.text)}
                      className={cx(
                        block?.author == 'bot' ? 'botMessage' : 'message'
                      )}
                    >
                      {block?.text}
                    </span>
                  </div>
                )
              }
            })
          )}
          {textLoaderActive && (
            <div className={s.botContainer}>
              <span className={s.botMessage}>
                <TextLoader />
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(handleSend)}>
          <textarea
            spellCheck='false'
            onKeyDown={handleKeyDown}
            className={s.textarea}
            placeholder={t('message_field.placeholder')}
            {...register('message', { required: true })}
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
                content={t('tooltips.dialog_renew')}
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
              {t('btns.send')}
            </Button>
          </SidePanelButtons>
        </form>
      </div>
    </div>
  )
}
