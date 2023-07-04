import classNames from 'classnames/bind'
import { useAuth, useUIOptions } from 'context'
import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQuery, useQueryClient } from 'react-query'
import {
  BotInfoInterface,
  ChatForm,
  ChatHistory,
  IDialogError,
  TDialogError,
} from 'types/types'
import {
  DEPLOY_STATUS,
  DUMMY_SKILL,
  OPEN_AI_LM,
  TOOLTIP_DELAY,
} from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { getDeploy } from 'api/deploy'
import { getUserId } from 'api/user'
import { useAssistants, useChat, useDeploy } from 'hooks/api'
import { useChatScroll } from 'hooks/useChatScroll'
import { useObserver } from 'hooks/useObserver'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { getAvailableDialogSession } from 'utils/getAvailableDialogSession'
import { getLSApiKeyByName } from 'utils/getLSApiKeys'
import { submitOnEnter } from 'utils/submitOnEnter'
import { Button } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { Loader, TextLoader } from 'components/Loaders'
import { BaseToolTip } from 'components/Menus'
import { SidePanelButtons, SidePanelHeader } from 'components/Panels'
import { DummyAlert } from 'components/UI'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import s from './AssistantDialogSidePanel.module.scss'

interface Props {
  dist: BotInfoInterface
}

export const AssistantDialogSidePanel: FC<Props> = ({ dist }) => {
  // queries
  const queryClient = useQueryClient()
  const { getDist, refetchDist } = useAssistants()
  const { deploy, deleteDeployment } = useDeploy()
  const { data: bot } = getDist(
    { distName: dist?.name },
    { refetchOnMount: true }
  )
  const { data: user } = useQuery(['user'], () => getUserId())
  const { send, renew, session, message, history, setSession, remoteHistory } =
    useChat()
  const [apiKey, setApiKey] = useState<string | null>(null)
  const auth = useAuth()

  const dummyAnswersCounter = history.filter(message => {
    return message?.active_skill?.name! === DUMMY_SKILL
  }).length

  const hereIsDummy = dummyAnswersCounter > 2

  const checkIsChatSettings = (userId: number) => {
    const isOpenAIModelInside = () => {
      return bot?.required_api_keys?.some(key => key?.name === 'openai_api_key')
    }
    if (userId === undefined || userId === null) return
    setErrorPanel(null)

    if (isOpenAIModelInside()) {
      const openaiApiKey = getLSApiKeyByName(userId, OPEN_AI_LM)
      const isApiKey =
        openaiApiKey !== null &&
        openaiApiKey !== undefined &&
        openaiApiKey.length > 0

      if (!isApiKey && bot?.author?.id !== 1) {
        setErrorPanel({
          type: 'api-key',
          msg: `Enter your personal access token for OpenAI to run your Generative AI Skill`,
        })
        return false
      }

      setApiKey(openaiApiKey)
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
          msg: 'The assistant build failed, please try again later.',
        })
        // queryClient.invalidateQueries(['privateDists'])
      }
    },
  }) //TODO transfer to useDeploy & add necessary conditions of invalidation
  const setError = (type: TDialogError) => {
    setErrorPanel({
      type: type,
      msg: 'Something went wrong...',
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

    const isChatSettings = checkIsChatSettings(user?.id)
    if (auth?.user && !isChatSettings) return

    const id = session?.id!

    send.mutate(
      {
        dialog_session_id: id,
        text: message,
        openai_api_key: apiKey ?? undefined,
      },
      {
        // onError: () => setError('chat'),
      }
    )
    reset()
  }
  const handleRenewClick = () => {
    renew.mutateAsync(bot?.name!)
    setErrorPanel(null)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))
  }
  const handleDeploy = () => {
    toast.promise(
      deploy.mutateAsync(bot?.name!, {
        onError: () => setError('deploy'),
      }),
      toasts.deploy
    )
  }
  const handleCheckChatSettings = () => {
    readyToGetSession && bot?.author?.id !== 1 && checkIsChatSettings(user?.id)
  }
  const handleEnterTokentClick = () => trigger('AccessTokensModal', {})

  // hooks
  useChatScroll(chatRef, [history, message, remoteHistory])

  // проверяем настройки
  useEffect(() => {
    if (!bot) return trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })

    handleCheckChatSettings()
  }, [user?.id, bot])
  useObserver('AccessTokensChanged', handleCheckChatSettings, [user?.id])

  // get existing dialog session || create new
  useEffect(() => {
    const availableSession =
      readyToGetSession && getAvailableDialogSession(bot?.name)

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

  return (
    <div id='assistantDialogPanel' className={s.container}>
      <SidePanelHeader>
        <ul role='tablist'>
          <li role='tab' key='Dialog'>
            <span aria-selected>Chat:</span>
            <span role='name'>&nbsp;{bot?.display_name}</span>
          </li>
        </ul>
      </SidePanelHeader>
      <div className={cx('dialogSidePanel', errorPanel && 'error')}>
        {errorPanel && (
          <>
            <span className={s.alertName}>Error!</span>
            <p className={s.alertDesc}>{errorPanel.msg}</p>
            {errorPanel.type === 'api-key' && (
              <div className={s.link}>
                <Button
                  theme='ghost'
                  props={{ onClick: handleEnterTokentClick }}
                >
                  Enter your personal access token here
                </Button>
              </div>
            )}
          </>
        )}
        {awaitDeployPanel && (
          <div className={s.await}>
            <Loader />
            <p className={s.notification}>
              Please wait till assistant launching
              <br />
              <br />
              This may take a few minutes.
              <br />
              <br />
              {status?.data?.state && status?.data?.state + '...'}
            </p>
          </div>
        )}
        {!errorPanel && deployPanel && (
          <div className={s.deployPanel}>
            <div className={s.text}>
              <h5 className={s.notification}>Chat with AI Assistant</h5>
              <p className={s.annotation}>
                In order to start chat with AI Assistant, it is necessary to
                build it
              </p>
            </div>
            <Button
              theme='primary'
              props={{
                onClick: handleDeploy,
                disabled: deploy?.isLoading || deleteDeployment.isLoading,
              }}
            >
              Build Assistant
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
                remoteHistory?.data?.map((block: ChatHistory, i: number) => {
                  return (
                    <div
                      key={`${block?.author == 'bot'}${i}`}
                      className={cx(
                        'chat__container',
                        block?.author == 'bot' && 'chat__container_bot'
                      )}
                    >
                      <span
                        className={cx(
                          'chat__message',
                          block?.author == 'bot' && 'chat__message_bot'
                        )}
                      >
                        {block?.text}
                        {/* {block?.author === 'bot' && (
                            <span className={s.skill}>
                              Skill: {block?.active_skill?.display_name}
                            </span>
                          )} */}
                      </span>
                    </div>
                  )
                })
              )}
              {history?.map((block, i: number) => (
                <div
                  key={`${block?.author == 'bot'}${i}`}
                  className={cx(
                    'chat__container',
                    block?.author == 'bot' && 'chat__container_bot'
                  )}
                >
                  <span
                    className={cx(
                      'chat__message',
                      block?.author == 'bot' && 'chat__message_bot'
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
              ))}
              {send?.isLoading && (
                <>
                  <div className={cx('chat__container_bot', 'chat__container')}>
                    <span className={cx('chat__message', 'chat__message_bot')}>
                      <TextLoader />
                    </span>
                  </div>
                </>
              )}
            </div>
            {hereIsDummy && <DummyAlert />}
            <form onKeyDown={handleKeyDown} onSubmit={handleSubmit(handleSend)}>
              <textarea
                spellCheck='false'
                className={s.textarea}
                placeholder='Type...'
                {...register('message', { required: true })}
              />

              <input type='submit' hidden />
              <SidePanelButtons>
                <Button
                  theme='secondary'
                  props={{
                    'data-tooltip-id': 'renew',
                    disabled: renew.isLoading || send?.isLoading,
                    onClick: handleRenewClick,
                  }}
                >
                  <SvgIcon iconName='renew' />
                </Button>
                <Button
                  theme='primary'
                  props={{ disabled: send?.isLoading, type: 'submit' }}
                >
                  Send
                </Button>
              </SidePanelButtons>
            </form>
          </>
        )}
      </div>
      <BaseToolTip
        isOpen={hereIsDummy}
        delayShow={TOOLTIP_DELAY}
        id='renew'
        content='Start a new dialog'
      />
    </div>
  )
}
