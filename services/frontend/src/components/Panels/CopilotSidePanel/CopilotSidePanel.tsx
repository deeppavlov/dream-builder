import classNames from 'classnames/bind'
import { useAuth, useUIOptions } from 'context'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import store from 'store2'
import DeepyHelperIcon from 'assets/icons/deeppavlov_logo_round.svg'
import { ReactComponent as Renew } from 'assets/icons/renew.svg'
import { ChatForm, ChatHistory, TDialogError } from 'types/types'
import { DEEPY_ASSISTANT, OPEN_AI_LM, TOOLTIP_DELAY } from 'constants/constants'
import { useDeepyChat } from 'hooks/api'
import { useChatScroll } from 'hooks/useChatScroll'
import { useObserver } from 'hooks/useObserver'
import { consts } from 'utils/consts'
import { сopyToClipboard } from 'utils/copyToClipboard'
import { trigger } from 'utils/events'
import { getLSApiKeyByName } from 'utils/getLSApiKeys'
import { submitOnEnter } from 'utils/submitOnEnter'
import { Button } from 'components/Buttons'
import { Loader, TextLoader } from 'components/Loaders'
import { BaseToolTip } from 'components/Menus'
import { SidePanelButtons, SidePanelHeader } from 'components/Panels'
import { ToastCopySucces } from 'components/UI'
import s from './CopilotSidePanel.module.scss'
import DummyErrorPanel from './DummyErrorPanel/DummyErrorPanel'

export type ErrorPanel = {
  type: 'auth' | 'api-key'
  msg: string
}
export const CopilotSidePanel = () => {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'sidepanels.deepy',
  })
  const {
    sendToDeepy,
    deepyHistory,
    deepySession,
    deepyRemoteHistory,
    renewDeepySession,
  } = useDeepyChat()

  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const { setUIOption } = useUIOptions()
  const { user } = useAuth()

  const cx = classNames.bind(s)
  const chatRef = useRef<HTMLDivElement>(null)
  const [errorPanel, setErrorPanel] = useState<ErrorPanel | null>(null)

  const sendDisabled = sendToDeepy?.isLoading || deepyRemoteHistory?.isLoading
  const renewDisabled = renewDeepySession?.isLoading || sendToDeepy?.isLoading

  const historyLoaderActive =
    (deepyRemoteHistory?.isFetching && !deepyRemoteHistory?.error) ||
    renewDeepySession?.isLoading
  const textLoaderActive = sendToDeepy?.isLoading

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

  const handleErrorBtnClick = (type: TDialogError) => {
    if (type === 'api-key') {
      trigger('AccessTokensModal', {})
    }
    if (type === 'auth') {
      trigger('SignInModal', {
        requestModal: { name: 'AccessTokensModal', options: {} },
      })
    }
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

  useObserver(
    'AccessTokensChanged',
    ({ detail: { newValue } }) => {
      if (newValue) {
        setErrorPanel(null)
      } else {
        deepyHistory.at(-1)?.active_skill?.name === 'dummy_skill' &&
          setErrorPanel({
            type: 'api-key',
            msg: t('error.token_error'),
          })
      }
    },
    [user?.id, deepyHistory]
  )

  useChatScroll(chatRef, [deepyHistory, errorPanel])

  useEffect(() => {
    setErrorPanel(null)
    const openaiApiKey =
      getLSApiKeyByName(user?.id!, OPEN_AI_LM, true) || undefined
    const deepySessionName = user ? `deepySession_${user.id}` : 'deepySession'
    const localSession = store(deepySessionName)
    if (
      localSession?.dummy ||
      (deepyHistory.at(-1)?.active_skill?.name === 'dummy_skill' &&
        !openaiApiKey)
    ) {
      if (!user) {
        setErrorPanel({
          type: 'auth',
          msg: t('error.auth_error'),
        })
      } else
        setErrorPanel({
          type: 'api-key',
          msg: t('error.token_error'),
        })
    }
  }, [deepyHistory, i18n.language])

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
        {errorPanel ? (
          <DummyErrorPanel
            errorPanel={errorPanel}
            handleErrorBtnClick={handleErrorBtnClick}
            handleRenewClick={handleRenewClick}
          />
        ) : (
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
        )}
      </div>
    </div>
  )
}
