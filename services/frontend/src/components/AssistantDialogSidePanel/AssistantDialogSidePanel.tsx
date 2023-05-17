import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import classNames from 'classnames/bind'
import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { RotatingLines } from 'react-loader-spinner'
import { useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { ReactComponent as Attention } from '../../assets/icons/attention.svg'
import { OPEN_AI_LM, TOOLTIP_DELAY } from '../../constants/constants'
import { useAuth } from '../../context/AuthProvider'
import { useDisplay } from '../../context/DisplayContext'
import { useAssistants } from '../../hooks/useAssistants'
import { useChat } from '../../hooks/useChat'
import { useChatScroll } from '../../hooks/useChatScroll'
import { useDeploy } from '../../hooks/useDeploy'
import { toasts } from '../../mapping/toasts'
import { RoutesList } from '../../router/RoutesList'
import { getDeploy } from '../../services/getDeploy'
import { getUserId } from '../../services/getUserId'
import {
  BotInfoInterface,
  ChatForm,
  IDialogError,
  TDialogError,
} from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { getLSApiKeyByName } from '../../utils/getLSApiKeys'
import { submitOnEnter } from '../../utils/submitOnEnter'
import { validationSchema } from '../../utils/validationSchema'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import TextLoader from '../TextLoader/TextLoader'
import s from './DialogSidePanel.module.scss'

interface Props {
  dist: BotInfoInterface
}

export const AssistantDialogSidePanel: FC<Props> = ({ dist }) => {
  // queries
  const queryClient = useQueryClient()
  const { getDist } = useAssistants()
  const { deploy, deleteDeployment } = useDeploy()
  const { data: bot } = getDist(dist?.name)
  const { data: user } = useQuery(['user'], () => getUserId())
  const { send, renew, session, message, history } = useChat()
  const [apiKey, setApiKey] = useState<string | null>(null)
  const auth = useAuth()

  const dummyAnswersCounter = history.filter(message => {
    return message.active_skill === 'dummy_skill'
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

  const { dispatch } = useDisplay()

  const status = useQuery({
    queryKey: ['deploy', bot?.deployment?.id],
    queryFn: () => getDeploy(bot?.deployment?.id!),
    refetchOnMount: false,
    enabled: bot?.deployment?.id !== undefined,
    onSuccess(data) {
      data?.state === 'UP' &&
        queryClient.invalidateQueries('dist', data?.virtual_assistant?.name)
      queryClient.invalidateQueries('privateDists')
      if (data?.state !== 'UP' && data?.state !== null && data?.error == null) {
        setTimeout(() => {
          queryClient.invalidateQueries('deploy', data?.id)
        }, 5000)
      } else if (data?.error !== null) {
        setErrorPanel({
          type: 'deploy',
          msg: 'The assistant build failed, please try again later.',
        })
        queryClient.invalidateQueries('privateDist')
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
  const deployPanel = bot?.deployment?.state == null //костыль
  const awaitDeployPanel =
    bot?.deployment?.state !== 'UP' &&
    bot?.deployment &&
    bot?.deployment?.state !== null
  const chatPanel = !awaitDeployPanel && !deployPanel && !errorPanel
  const readyToGetSession = bot?.deployment?.state === 'UP'

  // handlers
  const handleSend = (data: ChatForm) => {
    const isChatSettings = checkIsChatSettings(user?.id)

    if (auth?.user && !isChatSettings) return
    const id = session?.id!
    const message = data?.message!
    send.mutate(
      {
        dialog_session_id: id,
        text: message,
        openai_api_key: apiKey ?? undefined,
      },
      {
        onError: () => setError('chat'),
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
  const handleTryAgain = () => {
    toast.promise(
      deleteDeployment
        .mutateAsync(bot?.deployment?.id!)
        .then(() => {
          setErrorPanel(null)
        })
        .finally(() => {
          setErrorPanel(null)
          queryClient.invalidateQueries('privateDists')
          queryClient.invalidateQueries('dist')
        }),
      toasts.deleteDeployment
    )
  }

  const handleDeploy = () => {
    toast.promise(
      deploy.mutateAsync(bot?.name!, {
        onError: () => setError('deploy'),
      }),
      toasts.deploy
    )
  }
  // hooks
  // useObserver('RenewChat', handleRenewClick)
  useChatScroll(chatRef, [history, message])

  // проверяем настройки
  useEffect(() => {
    bot?.author?.id !== 1 && checkIsChatSettings(user?.id)
  }, [user?.id, bot])

  // обновляем диалоговую сессию
  useEffect(() => {
    readyToGetSession && renew.mutateAsync(bot?.name!)
  }, [bot?.deployment?.state])

  const dispatchTrigger = (isOpen: boolean) => {
    dispatch({
      type: 'set',
      option: {
        id: consts.ACTIVE_ASSISTANT_SP_ID,
        value: isOpen ? bot?.id : null,
      },
    })
  }

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])

  return (
    <div id='assistantDialogPanel' className={s.container}>
      <SidePanelHeader>
        <>
          <ul role='tablist'>
            <li role='tab' key='Dialog'>
              <span aria-selected>Chat:</span>
              <span role='name'>&nbsp;{bot?.display_name}</span>
            </li>
          </ul>
        </>
      </SidePanelHeader>
      <div className={cx('dialogSidePanel', errorPanel && 'error')}>
        {errorPanel && (
          <>
            <span className={s.alertName}>Error!</span>
            <p className={s.alertDesc}>{errorPanel.msg}</p>
            {errorPanel.type === 'api-key' && (
              <Link className={s.link} to={RoutesList.profile}>
                Enter your personal access token here
              </Link>
            )}
            {bot?.author?.id !== 1 && bot?.visibility !== 'public_template' && (
              <Button theme='error' props={{ onClick: handleTryAgain }}>
                Try again
              </Button>
            )}
          </>
        )}
        {awaitDeployPanel && (
          <div className={s.await}>
            <RotatingLines
              strokeColor='grey'
              strokeWidth='5'
              animationDuration='0.75'
              width='64'
              visible={true}
            />
            <p className={s.notification}>
              Please wait till assistant launching
            </p>
            <p className={s.notification}>This may take a few minutes.</p>
            <p className={s.notification}>{status?.data?.state + '...'}</p>
            <br />
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
                        Skill: {block?.active_skill}
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
            {hereIsDummy && (
              <div className={s.dummyContainer}>
                <div className={s.dummy}>
                  <span className={s.line} />
                  <div className={s.message}>
                    <div className={s.circle}>
                      {/* TODO: Change SVG ReactComponent to our SvgComponent */}
                      <Attention />
                    </div>
                    <p>
                      Something went wrong.
                      <br />
                      Restart the system.
                    </p>
                  </div>
                  <span className={s.line} />
                </div>
              </div>
            )}
            <form onKeyDown={handleKeyDown} onSubmit={handleSubmit(handleSend)}>
              <textarea
                className={s.dialogSidePanel__textarea}
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
                    disabled: renew.isLoading,
                    onClick: handleRenewClick,
                  }}
                >
                  <Renew data-tooltip-id='renew' />
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
