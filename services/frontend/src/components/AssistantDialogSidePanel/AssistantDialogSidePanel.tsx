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
import { RoutesList } from '../../router/RoutesList'
import { getDeploy } from '../../services/getDeploy'
import { getUserId } from '../../services/getUserId'
import { BotInfoInterface, ChatForm, ISkill } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'
import { checkLMIsOpenAi, getLSApiKeyByName } from '../../utils/getLSApiKeys'
import { submitOnEnter } from '../../utils/submitOnEnter'
import { validationSchema } from '../../utils/validationSchema'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { IDialogError } from '../SkillDialog/SkillDialog'
import TextLoader from '../TextLoader/TextLoader'
import s from './DialogSidePanel.module.scss'

interface Props {
  dist: BotInfoInterface
}

export const AssistantDialogSidePanel: FC<Props> = ({ dist }) => {
  const { getAllComponents } = useComponent()

  const { data: user } = useQuery(['user'], () => getUserId())
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
    if (userId === undefined || userId === null) return
    console.log('Start checking dialog settings...')
    console.log('foo = ', bot?.author?.id)
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

  const { getDist } = useAssistants()
  const { data: bot } = getDist(dist?.name)
  const componentsInside = getAllComponents(bot?.name!)

  useEffect(() => {
    checkIsChatSettings(user?.id)
  }, [user?.id])

  const { deploy, deleteDeployment } = useDeploy()
  const queryClient = useQueryClient()
  // const clearStates = () => {
  //   setErrorPanel(null)
  //   setApiKey(null)
  // }
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

  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const {
    send,
    renew,
    session,
    message,
    history,
    error: errorFromChat,
  } = useChat()
  const { dispatch } = useDisplay()
  const deployPanel = bot?.deployment?.state == null //костыль
  const awaitDeployPanel =
    bot?.deployment?.state !== 'DEPLOYED' &&
    bot?.deployment &&
    bot?.deployment?.state !== null
  const chatPanel = !awaitDeployPanel && !deployPanel && !errorPanel

  // handlers
  const handleGoBackBtnClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }

  const handleSend = (data: ChatForm) => {
    const isChatSettings = checkIsChatSettings(user?.id)

    if (!isChatSettings) return
    const id = session?.id!
    const message = data?.message!
    send.mutate({
      dialog_session_id: id,
      text: message,
      openai_api_key: apiKey ?? undefined,
    })
    reset()
  }
  const handleRenewClick = () => {
    renew.mutateAsync(bot?.name!)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))
  }

  // hooks
  useObserver('RenewChat', handleRenewClick)
  useChatScroll(chatRef, [history, message])

  const readyToGetSession = bot?.deployment?.state === 'DEPLOYED'

  useEffect(() => {
    readyToGetSession && renew.mutateAsync(bot?.name!)
  }, [bot?.deployment])

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
  const handleTryAgain = () => {
    deleteDeployment
      .mutateAsync(bot?.deployment?.id!)
      .then(() => {
        setErrorPanel(null)
      })
      .finally(() => {
        setErrorPanel(null)
      })
  }
  const handleDeploy = () => {
    toast.promise(
      deploy.mutateAsync(bot?.name!, {
        onError: () =>
          setErrorPanel({
            type: 'deploy',
            msg: 'Something Went Wrong',
          }),
      }),
      {
        loading: 'Loading...',
        success: 'Send For Deploy!',
        error: 'Something Went Wrong...',
      }
    )
  }
  return (
    <div className={s.container}>
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
      <div
        className={cx(
          'dialogSidePanel',
          errorFromChat && 'error',
          errorPanel && 'error'
        )}
      >
        {errorFromChat && (
          <>
            <span className={s.alerName}>Alert!</span>
            <p className={s.alertDesc}>
              Check the settings of your bot. Something went wrong!
            </p>
            <button onClick={handleGoBackBtnClick}>Go back</button>
          </>
        )}
        {errorPanel && (
          <>
            <span className={s.alertName}>Error!</span>
            <p className={s.alertDesc}>{errorPanel.msg}</p>
            {errorPanel.type === 'api-key' && (
              <Link className={s.link} to={RoutesList.profile}>
                Enter your personal access token here
              </Link>
            )}
            <Button theme='error' props={{ onClick: handleTryAgain }}>
              Try again
            </Button>
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
                disabled: deploy?.isLoading || deploy?.isSuccess,
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
