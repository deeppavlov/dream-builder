import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import classNames from 'classnames/bind'
import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { RotatingLines } from 'react-loader-spinner'
import { useQuery, useQueryClient } from 'react-query'
import { DEBUG_DIST, TOOLTIP_DELAY } from '../../constants/constants'
import { useDisplay } from '../../context/DisplayContext'
import { useAssistants } from '../../hooks/useAssistants'
import { useChat } from '../../hooks/useChat'
import { useChatScroll } from '../../hooks/useChatScroll'
import { useDeploy } from '../../hooks/useDeploy'
import { useObserver } from '../../hooks/useObserver'
import { getDeploy } from '../../services/getDeploy'
import { BotInfoInterface, ChatForm } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'
import { submitOnEnter } from '../../utils/submitOnEnter'
import { validationSchema } from '../../utils/validationSchema'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import TextLoader from '../TextLoader/TextLoader'
import s from './DialogSidePanel.module.scss'

type ChatPanelType = 'bot' | 'skill'

interface Props {
  error?: boolean
  start?: boolean
  chatWith: ChatPanelType
  dist: BotInfoInterface
  debug: boolean
}

const DialogSidePanel: FC<Props> = ({ start, chatWith, dist, debug }) => {
  // const { components } = useComponent(dist?.name)
  // const [dialogError, setDilogError] = useState(null)
  // const isOpenAIModelInside = components?.skills.filter((skill: ISkill) => {
  //   return (
  //     skill?.component_type === 'Generative' &&
  //     checkLMIsOpenAi(skill?.lm_service?.name!)
  //   )
  // })
  // const { data: user } = useQuery(['user'], () => getUserId())
  // const [apiKey, setApiKey] = useState<string | null>(null)
  // const openApiKey = getLSApiKeyByName(user?.id, OPEN_AI_LM)
  // const skillHasOpenAiLM = isOpenAIModelInside?.length > 0

  // console.log('openApiKey = ', openApiKey)
  // const checkKey = () => {}
  // useEffect
  // if (skillHasOpenAiLM) {
  //   const openaiApiKey = getLSApiKeyByName(user?.id, OPEN_AI_LM)
  //   const isApiKey =
  //     openaiApiKey !== null &&
  //     openaiApiKey !== undefined &&
  //     openaiApiKey.length > 0

  //   if (!isApiKey) {
  //     setDilogError({
  //       type: 'api-key',
  //       msg: `Enter your personal access token for OpenAI to run your Generative AI Skill`,
  //     })
  //     return false
  //   }

  //   setApiKey(openaiApiKey)
  // }
  // useEffect(() => {}, [])
  // console.log('error = ', dialogError)
  const { getDist } = useAssistants()
  const { data: bot } = getDist(dist?.name)
  // console.log('bott = ', bot?.deployment?.state)

  const [isFirstTest, setIsFirstTest] = useState(start)
  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const { send, renew, session, message, history, error } = useChat()
  const { dispatch } = useDisplay()
  const chatRef = useRef<HTMLDivElement>(null)
  // const [bot, setBot] = useState<BotInfoInterface>(dist)

  const startPanel = isFirstTest && !error
  const chatPanel = !isFirstTest && !error

  const deployPanel = bot?.deployment?.state == null //костыль

  const awaitDeployPanel =
    bot?.deployment?.state !== 'DEPLOYED' &&
    bot?.deployment &&
    bot?.deployment?.state !== null
  // console.log('awaitDeployPanel = ', awaitDeployPanel)
  const cx = classNames.bind(s)

  useEffect(() => {}, [])
  // handlers
  const handleGoBackBtnClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }
  const handleStartBtnClick = () => {
    renew.mutateAsync(debug ? DEBUG_DIST : bot?.name!).then(() => {
      setIsFirstTest(false)
    })
  }
  const handleSend = (data: ChatForm) => {
    const id = session?.id!
    const message = data?.message!
    send.mutate({ dialog_session_id: id, text: message })
    reset()
  }
  const handleRenewClick = () => {
    renew.mutateAsync(debug ? DEBUG_DIST : bot?.name!)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))
  }

  // hooks
  useObserver('RenewChat', handleRenewClick)
  useChatScroll(chatRef, [history, message])

  const readyToGetSession =
    !isFirstTest && bot?.deployment?.state === 'DEPLOYED'

  useEffect(() => {
    if (readyToGetSession || bot?.deployment?.state === 'DEPLOYED') {
      renew.mutateAsync(debug ? DEBUG_DIST : bot?.name!)
    }
  }, [bot?.deployment, bot?.deployment])

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

  const { deploy } = useDeploy()
  const queryClient = useQueryClient()

  // console.log('isQueryEnable = ', isQueryEnable())
  // const isQueryEnable = () => status?.data?.state === 'DEPLOYED'

  const status = useQuery({
    queryKey: ['deploy', bot?.deployment?.id],
    queryFn: () => getDeploy(bot?.deployment?.id!),
    refetchOnMount: false,
    enabled: bot?.deployment?.id !== undefined,
    onSuccess(data) {
      if (data?.state !== 'DEPLOYED' && data?.state !== null) {
        setTimeout(() => {
          queryClient.invalidateQueries('deploy', data?.id)
          queryClient.invalidateQueries('dist', data?.virtual_assistant?.name)
        }, 5000)
      } else if (data?.error !== null) {
        console.log('data?.error = ', data?.error)
        // queryClient.invalidateQueries('dist', data?.virtual_assistant?.name)
        queryClient.invalidateQueries('privateDist')
      }
    },
  })

  // console.log(
  //   'status= ',
  //   status?.data?.state,
  //   'deploy state = ',
  //   bot?.deployment?.state
  // )

  const handleDeploy = () => {
    toast.promise(deploy.mutateAsync(bot?.name!), {
      loading: 'Loading...',
      success: 'Send For Deploy!',
      error: 'Something Went Wrong...',
    })
  }
  return (
    <div className={s.container}>
      <SidePanelHeader>
        {chatWith == 'skill' && (
          <>
            <ul role='tablist'>
              <li role='tab' key='Current  Skill' aria-selected>
                Current Skill
              </li>
              <li role='tab' key='All Skills'>
                All Skills
              </li>
            </ul>
          </>
        )}
        {chatWith == 'bot' && (
          <>
            <ul role='tablist'>
              <li role='tab' key='Dialog'>
                <span aria-selected>Chat:</span>
                <span role='name'>&nbsp;{bot?.display_name}</span>
              </li>
            </ul>
          </>
        )}
      </SidePanelHeader>
      <div
        className={cx(
          'dialogSidePanel',
          startPanel && 'start',
          error && 'error'
        )}
      >
        {error && (
          <>
            <span className={s.alerName}>Alert!</span>
            <p className={s.alertDesc}>
              Check the settings of your bot. Something went wrong!
            </p>
            <button onClick={handleGoBackBtnClick}>Go back</button>
          </>
        )}
        {startPanel && (
          <>
            <span className={s.alertName}>Run your bot</span>
            <p className={s.alertDesc}>
              Start a test to interact with your bot using text, voice or
              buttons
            </p>
            <button className={s.runTest} onClick={handleStartBtnClick}>
              {renew.isLoading ? <TextLoader /> : 'Run Test'}
            </button>
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
        {deployPanel && (
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
              props={{ onClick: handleDeploy, disabled: deploy?.isLoading }}
            >
              Build Assistant
            </Button>
          </div>
        )}
        {!awaitDeployPanel && !deployPanel && chatPanel && (
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
            {/* <div className={s.dialogSidePanel__controls}>
              <div className={s.left}></div>
              <div className={s.right}>
                <Button
                  small
                  theme='secondary'
                  withIcon
                  props={{ onClick: handleRenewClick }}
                >
                  <div className={s['right-container']} data-tooltip-id='renew'>
                    <Renew />
                  </div>
                </Button>
              </div>
            </div> */}
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

export default DialogSidePanel
