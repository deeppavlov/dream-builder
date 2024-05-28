import classNames from 'classnames/bind'
import { useAuth, useUIOptions } from 'context'
import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Trans, useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from 'react-query'
import {
  BotInfoInterface,
  ChatForm,
  ChatHistory,
  IDialogError,
  IUserApiKey,
  TDialogError,
  TKey,
} from 'types/types'
import { DEPLOY_STATUS, DUMMY_SKILL, TOOLTIP_DELAY } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { getDeploy } from 'api/deploy'
import { useAssistants, useChat, useComponent, useDeploy } from 'hooks/api'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { useGaToken } from 'hooks/googleAnalytics/useGaToken'
import { useGaChat } from 'hooks/googleAnalytics/useGaVaChat'
import { useChatScroll } from 'hooks/useChatScroll'
import { useObserver } from 'hooks/useObserver'
import { examinationMessage } from 'utils/checkingAssistants'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { getAvailableDialogSession } from 'utils/getAvailableDialogSession'
import { getLSApiKeys } from 'utils/getLSApiKeys'
import { submitOnEnter } from 'utils/submitOnEnter'
import { Button } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { Loader, TextLoader } from 'components/Loaders'
import { BaseToolTip } from 'components/Menus'
import { SidePanelButtons, SidePanelHeader } from 'components/Panels'
import { ErrorCard } from 'components/UI'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import s from './AssistantDialogSidePanel.module.scss'

interface Props {
  dist: BotInfoInterface
}

export const AssistantDialogSidePanel: FC<Props> = ({ dist }) => {
  const { getAllComponents } = useComponent()
  const { t, i18n } = useTranslation()
  // queries
  const queryClient = useQueryClient()
  const { getDist, refetchDist } = useAssistants()
  const { deploy, deleteDeployment } = useDeploy()
  const { data: bot } = getDist(
    { distName: dist?.name },
    { refetchOnMount: true }
  )
  const { user } = useAuth()
  const { send, renew, session, message, history, setSession, remoteHistory } =
    useChat()
  const [usedApiKeys, setUsedApiKeys] = useState<IUserApiKey[]>([])
  const { vaChangeDeployState } = useGaAssistant()
  const { chatSend, refreshChat } = useGaChat()
  const { setTokenState, missingTokenError } = useGaToken()

  const dummyAnswersCounter = history.filter(message => {
    return message?.active_skill?.name! === DUMMY_SKILL
  }).length

  const hereIsDummy = dummyAnswersCounter > 2

  const checkIsChatSettings = (userId: number | undefined) => {
    setErrorPanel(null)

    const modelsApiKeyRequired = (bot?.used_lm_services || [])
      .filter(service => service.api_key)
      .map(({ name, display_name }) => ({
        name,
        display_name,
      }))

    const requiredKeys = modelsApiKeyRequired.map(m => m.name)

    if (requiredKeys.length > 0) {
      if (!userId) {
        setErrorPanel({
          type: 'auth',
          msg: t('api_key.required.auth_required'),
        })
        return false
      }
      const userApiKeys = getLSApiKeys(userId) || []
      setUsedApiKeys(userApiKeys)

      const modelsWithUserKeys = userApiKeys.flatMap(k =>
        Object.entries(k.lmUsageState).reduce(
          (acc: string[], [name, status]) => {
            if (!status) return acc
            return [...acc, name]
          },
          []
        )
      )
      const missingKeys = requiredKeys.filter(
        k => !modelsWithUserKeys.includes(k)
      )

      if (missingKeys.length) {
        const lmServicesWithoutKeys = Array.from(
          new Set(
            modelsApiKeyRequired
              .filter(({ name }) => missingKeys.includes(name))
              .map(({ display_name }) => display_name)
          )
        )
        setErrorPanel({
          type: 'api-key',
          msg: t('api_key.required.assistant_label', {
            count: lmServicesWithoutKeys.length,
            service: lmServicesWithoutKeys.join(', '),
          }),
        })

        const services = [
          ...new Set(
            bot?.used_lm_services
              .map(s => s.api_key?.display_name)
              .filter(name => name)
          ),
        ].join(', ')
        missingTokenError('va_dialog_panel', services)
        return false
      }
    }
    return true
  }

  const cx = classNames.bind(s)
  const chatRef = useRef<HTMLDivElement>(null)

  const [errorPanel, setErrorPanel] = useState<IDialogError | null>(null)

  const { handleSubmit, register, reset } = useForm<ChatForm>()

  const { setUIOption } = useUIOptions()

  const status = useQuery({
    queryKey: ['deploy', bot?.deployment?.id],
    queryFn: () => getDeploy(bot?.deployment?.id!),
    refetchOnMount: false,
    enabled: bot?.deployment?.id !== undefined,
    onSuccess(data) {
      if (data?.state === DEPLOY_STATUS.UP) {
        refetchDist.mutateAsync(bot?.name!)
        queryClient.invalidateQueries(['privateDists'])
      }
      if (
        data?.state !== DEPLOY_STATUS.UP &&
        data?.state !== null &&
        data?.error == null
      ) {
        //FIX
        setTimeout(() => {
          queryClient.invalidateQueries(['deploy', data?.id])
        }, 5000)
      } else if (data?.error !== null) {
        setErrorPanel({
          type: 'deploy',
          msg: t('sidepanels.assistant_dialog.deploy.error'),
        })
        // queryClient.invalidateQueries(['privateDists'])
      }
    },
  }) //TODO transfer to useDeploy & add necessary conditions of invalidation
  const setError = (type: TDialogError) => {
    setErrorPanel({
      type: type,
      msg: t('toasts.error'),
    })
  }

  // panel state
  const deployPanel = bot?.deployment?.state == null //FIX
  const awaitDeployPanel =
    bot?.deployment?.state !== DEPLOY_STATUS.UP &&
    bot?.deployment &&
    bot?.deployment?.state !== null
  const chatPanel = !awaitDeployPanel && !deployPanel && !errorPanel
  const readyToGetSession = bot?.deployment?.state === DEPLOY_STATUS.UP

  // handlers
  const handleSend = ({ message }: ChatForm) => {
    const isMessage = message.replace(/\s/g, '').length > 0
    if (!isMessage) return

    const requiredApiKeys = (bot?.used_lm_services || [])
      .map(s => s.api_key)
      .filter(key => !!key) as TKey[] // after filtering there will be no elements equal to null in the array

    const keys = requiredApiKeys
      .map(k => k.name)
      .reduce((acc, keyName) => {
        return {
          ...acc,
          [keyName]: usedApiKeys.find(k => k.api_service.name === keyName)
            ?.token_value,
        }
      }, {})

    const id = session?.id!

    send.mutate(
      {
        dialog_session_id: id,
        text: message,
        apiKeys: keys,
      },
      {
        // onError: () => setError('chat'),
      }
    )
    chatSend(history.length)

    reset()
  }
  const handleRenewClick = () => {
    refreshChat(bot)

    renew.mutateAsync(bot?.name!)
    setErrorPanel(null)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))
  }
  const handleDeploy = () => {
    toast.promise(
      deploy
        .mutateAsync(bot?.name!, {
          onError: e =>
            setErrorPanel({
              type: 'deploy',
              msg:
                e.response?.data.detail ===
                'You have exceeded your deployment limit for virtual assistants!'
                  ? t(
                      'sidepanels.assistant_dialog.toasts.deployment_limitation_error'
                    )
                  : t('toasts.error'),
            }),
        })
        .then(() => vaChangeDeployState('VA_Deployed', 'va_sidepanel')),
      toasts().deploy
    )
  }
  const handleCheckChatSettings = () => {
    readyToGetSession && checkIsChatSettings(user?.id)
  }

  const handleErrorBtnClick = (type: TDialogError) => {
    if (type === 'api-key') {
      const services = [
        ...new Set(
          bot?.used_lm_services
            ?.map(item => item.api_key?.display_name)
            .filter(name => name)
        ),
      ].join(', ')
      setTokenState('va_dialog_panel', services)
      trigger('AccessTokensModal', {})
    }
    if (type === 'auth') {
      trigger('SignInModal', {
        requestModal: { name: 'AccessTokensModal', options: {} },
      })
    }
  }

  // hooks
  useChatScroll(chatRef, [history, message, remoteHistory])

  // проверяем настройки
  useEffect(() => {
    if (!bot) return trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })

    handleCheckChatSettings()
  }, [user, bot, i18n.language])
  useObserver('AccessTokensChanged', handleCheckChatSettings, [user?.id])

  // get existing dialog session || create new
  useEffect(() => {
    const availableSession =
      readyToGetSession && getAvailableDialogSession(bot?.name, user?.id)

    availableSession
      ? remoteHistory
          .mutateAsync(availableSession?.id)
          .then(() => {
            setSession(availableSession)
          })
          .finally(() => {
            setSession(availableSession) //FIX
          })
      : readyToGetSession && renew.mutateAsync(bot?.name!)
  }, [bot?.deployment?.state])

  const dispatchTrigger = (isOpen: boolean) => {
    setUIOption({
      name: consts.CHAT_SP_IS_ACTIVE,
      value: isOpen ? bot : null,
    })
  }

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])

  const components = getAllComponents(bot?.name || '', {
    refetchOnMount: true,
  })

  const resultExamination = examinationMessage(components)

  const { isError } = resultExamination

  return (
    <div id='assistantDialogPanel' className={s.container}>
      <SidePanelHeader>
        <ul role='tablist'>
          <li role='tab' key='Dialog'>
            <span aria-selected>
              {t('sidepanels.assistant_dialog.tabs.name')}
            </span>
            <span role='name'>&nbsp;{bot?.display_name}</span>
          </li>
        </ul>
      </SidePanelHeader>
      <div className={cx('dialogSidePanel', errorPanel && 'error')}>
        {errorPanel && (
          <>
            <span className={s.alertName}>Error!</span>
            <p className={s.alertDesc}>{errorPanel.msg}</p>
            {(errorPanel.type === 'auth' || errorPanel.type === 'api-key') && (
              <Button
                theme='primary'
                props={{ onClick: () => handleErrorBtnClick(errorPanel.type) }}
              >
                {t(`api_key.required.${errorPanel.type}`)}
              </Button>
            )}
          </>
        )}
        {awaitDeployPanel && (
          <div className={s.await}>
            <Loader />
            <p className={s.notification}>
              {t('sidepanels.assistant_dialog.deploy.loading_wait_text')}
              <br />
              <br />
              {t('sidepanels.assistant_dialog.deploy.loading_time_text')}
              <br />
              <br />
              {status?.data?.state && status?.data?.state + '...'}
            </p>
          </div>
        )}
        {!errorPanel && deployPanel && (
          <div className={s.deployPanel}>
            <div className={s.text}>
              <h5 className={s.notification}>
                {t('sidepanels.assistant_dialog.deploy.header')}
              </h5>
              <p
                className={s.annotation}
                style={isError ? { color: 'red' } : {}}
              >
                {isError
                  ? resultExamination.message
                  : t('sidepanels.assistant_dialog.deploy.subheader')}
              </p>
            </div>
            <Button
              theme='primary'
              props={{
                onClick: handleDeploy,
                disabled:
                  deploy?.isLoading || deleteDeployment.isLoading || isError,
              }}
            >
              {t('sidepanels.assistant_dialog.btns.build_assistant')}
            </Button>
          </div>
        )}
        {chatPanel && (
          <>
            <div className={s.chat} ref={chatRef}>
              {remoteHistory?.isLoading && !remoteHistory?.error ? (
                <div className={s.loaderWrapper}>
                  <Loader />
                </div>
              ) : (
                history.map((block: ChatHistory, i: number) => {
                  return (
                    <div
                      key={`${block?.author == 'bot'}${i}`}
                      className={cx(
                        block?.author == 'bot'
                          ? 'botContainer'
                          : 'userContainer'
                      )}
                    >
                      <span
                        className={cx(
                          block?.author == 'bot' ? 'botMessage' : 'message'
                        )}
                      >
                        {block?.text}
                        {block?.author === 'bot' && (
                          <span className={s.skill}>
                            Skill: {block?.active_skill?.display_name}
                          </span>
                        )}
                      </span>
                    </div>
                  )
                })
              )}
              {send?.isLoading && (
                <>
                  <div className={s.botContainer}>
                    <span className={s.botMessage}>
                      <TextLoader />
                    </span>
                  </div>
                </>
              )}
            </div>
            {hereIsDummy && (
              <div className={s.dummyContainer}>
                <ErrorCard
                  isWhite
                  type='warning'
                  message={
                    <Trans i18nKey='sidepanels.assistant_dialog.dummy_error' />
                  }
                />
              </div>
            )}
            <form onKeyDown={handleKeyDown} onSubmit={handleSubmit(handleSend)}>
              <textarea
                spellCheck='false'
                className={s.textarea}
                placeholder={t(
                  'sidepanels.assistant_dialog.message_field.placeholder'
                )}
                {...register('message', { required: true })}
              />

              <input type='submit' hidden />
              <SidePanelButtons>
                <Button
                  theme='secondary'
                  props={{
                    disabled: renew.isLoading || send?.isLoading,
                    onClick: handleRenewClick,
                    'data-tooltip-id': 'renew',
                  }}
                >
                  <SvgIcon iconName='renew' />
                </Button>
                <Button
                  theme='primary'
                  props={{ disabled: send?.isLoading, type: 'submit' }}
                >
                  {t('sidepanels.assistant_dialog.btns.send')}
                </Button>
              </SidePanelButtons>
            </form>
          </>
        )}
      </div>
      {!hereIsDummy && (
        <BaseToolTip
          delayShow={TOOLTIP_DELAY}
          id='renew'
          content={t('tooltips.dialog_renew')}
        />
      )}
    </div>
  )
}
