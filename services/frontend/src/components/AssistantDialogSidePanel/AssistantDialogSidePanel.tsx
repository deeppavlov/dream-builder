import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import classNames from 'classnames/bind'
import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { RotatingLines } from 'react-loader-spinner'
import { useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { OPEN_AI_LM, TOOLTIP_DELAY } from '../../constants/constants'
import { useDisplay } from '../../context/DisplayContext'
import { useAssistants } from '../../hooks/useAssistants'
import { useChat } from '../../hooks/useChat'
import { useChatScroll } from '../../hooks/useChatScroll'
import { useComponent } from '../../hooks/useComponent'
import { useDeploy } from '../../hooks/useDeploy'
import { useObserver } from '../../hooks/useObserver'
import { toasts } from '../../mapping/toasts'
import { RoutesList } from '../../router/RoutesList'
import { getDeploy } from '../../services/getDeploy'
import { getUserId } from '../../services/getUserId'
import {
  BotInfoInterface,
  ChatForm,
  IDialogError,
  ISkill,
  TDialogError,
} from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { checkLMIsOpenAi, getLSApiKeyByName } from '../../utils/getLSApiKeys'
import { submitOnEnter } from '../../utils/submitOnEnter'
import { validationSchema } from '../../utils/validationSchema'
import BaseToolTip from '../BaseToolTip/BaseToolTip'

import TextLoader from '../TextLoader/TextLoader'
import s from './DialogSidePanel.module.scss'

interface Props {
  dist: BotInfoInterface
}

export const AssistantDialogSidePanel: FC<Props> = ({ dist }) => {
  // console.log('dist = ', dist)
  // queries
  const queryClient = useQueryClient()
  const { getDist } = useAssistants()
  const { deploy, deleteDeployment } = useDeploy()
  const { getAllComponents } = useComponent()
  const { data: bot } = getDist(dist?.name)
  const componentsInside = getAllComponents(bot?.name!)

  const { data: user } = useQuery(['user'], () => getUserId())
  // console.log('user = ', user)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const checkIsChatSettings = (userId: number) => {
    const isOpenAIModelInside = () => {
      return (
        componentsInside?.data?.skills &&
        componentsInside?.data?.skills.filter((skill: ISkill) => {
          return (
            skill?.component_type === 'Generative' &&
            checkLMIsOpenAi(skill?.lm_service?.name!)
          )
        }).length! > 0
      )
    }
    // console.log('apiKey = ', apiKey)
    // console.log('userId = ', userId)
    if (userId === undefined || userId === null) return
    console.log('Start checking dialog settings...')
    setErrorPanel(null)

    if (isOpenAIModelInside()) {
      const openaiApiKey = getLSApiKeyByName(userId, OPEN_AI_LM)
      // console.log('openaiApiKey = ', openaiApiKey)
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
  const { send, renew, session, message, history } = useChat()
  const { dispatch } = useDisplay()

  const status = useQuery({
    queryKey: ['deploy', bot?.deployment?.id],
    queryFn: () => getDeploy(bot?.deployment?.id!),
    refetchOnMount: false,
    enabled: bot?.deployment?.id !== undefined,
    onSuccess(data) {
      data?.state === 'DEPLOYED' &&
        queryClient.invalidateQueries('dist', data?.virtual_assistant?.name)
      queryClient.invalidateQueries('privateDists')
      if (
        data?.state !== 'DEPLOYED' &&
        data?.state !== null &&
        data?.error == null
      ) {
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
  })
  const setError = (type: TDialogError) => {
    setErrorPanel({
      type: type,
      msg: 'Something Went Wrong...',
    })
  }

  // panel state
  const deployPanel = bot?.deployment?.state == null //костыль
  const awaitDeployPanel =
    bot?.deployment?.state !== 'DEPLOYED' &&
    bot?.deployment &&
    bot?.deployment?.state !== null
  const chatPanel = !awaitDeployPanel && !deployPanel && !errorPanel
  const readyToGetSession = bot?.deployment?.state === 'DEPLOYED'

  // handlers
  const handleSend = (data: ChatForm) => {
    const isChatSettings = checkIsChatSettings(user?.id)

    if (!isChatSettings) return
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
  useObserver('RenewChat', handleRenewClick)
  useChatScroll(chatRef, [history, message])

  // проверяем настройки
  useEffect(() => {
    checkIsChatSettings(user?.id)
  }, [user?.id])

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
            <p className={s.notification}>
              {status?.data?.state}
              {'      '}
              <TextLoader />
              <br />
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
              {history?.map(
                (block: { author: string; text: string }, i: number) => (
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
                    </span>
                  </div>
                )
              )}
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
        delayShow={TOOLTIP_DELAY}
        id='renew'
        content='Start a new dialog'
      />
    </div>
  )
}
