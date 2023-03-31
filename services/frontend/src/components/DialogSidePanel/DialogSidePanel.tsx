import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DownloadDialogIcon } from '@assets/icons/dialog_download.svg'
import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import DialogButton from '../DialogButton/DialogButton'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import Button from '../../ui/Button/Button'
import { getHistory } from '../../services/getHistory'
import { sendMessage } from '../../services/sendMessage'
import { renewDialog } from '../../services/renewDialog'
import classNames from 'classnames/bind'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import { BotInfoInterface } from '../../types/types'
import TextLoader from '../TextLoader/TextLoader'
import s from './DialogSidePanel.module.scss'
import { useObserver } from '../../hooks/useObserver'

const TEXT_CHAT_TYPE = 'text'
const VOICE_CHAT_TYPE = 'voice'
export const DEBUG_DIST = 'universal_prompted_assistant'
type ChatType = typeof TEXT_CHAT_TYPE | typeof VOICE_CHAT_TYPE
type ChatPanelType = 'bot' | 'skill'
type Message = { message: string }
interface Props {
  error?: boolean
  start?: boolean
  chatWith: ChatPanelType
  dist: BotInfoInterface
  debug: boolean
  distName: string
  service: string
  prompt: string
}
export interface SessionConfig {
  id: number
  is_active: boolean
  user_id: boolean
  virtual_assistant_id: number
}
const DialogSidePanel: FC<Props> = ({
  error,
  start,
  chatWith,
  dist,
  debug,
  distName,
  service,
  prompt,
}) => {
  const [chatType, setChatType] = useState<ChatType>(TEXT_CHAT_TYPE)
  const [isError, setIsError] = useState(error ?? false)
  const [isFirstTest, setIsFirstTest] = useState(start)
  const [message, setMessage] = useState<string>('')
  const { handleSubmit, register, reset } = useForm()
  const [dialogSession, setDialogueSession] = useState<SessionConfig | null>(
    null
  )
  const cx = classNames.bind(s)
  const queryClient = useQueryClient()
  const chatRef = useRef<HTMLDivElement>(null)
  const isTextChat = chatType === TEXT_CHAT_TYPE
  // const isVoiceChat = chatType === VOICE_CHAT_TYPE
  const startPanel = isFirstTest && !isError
  const chatPanel = !isFirstTest && !isError

  const { data: history } = useQuery(
    ['history', dialogSession?.id],
    () => getHistory(dialogSession?.id!),
    { enabled: !!message }
  )

  const handleTypeBtnClick = (type: ChatType) => setChatType(type)

  const handleDownloadBtnClick = () => {}

  const handleGoBackBtnClick = () =>
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })

  const handleStartBtnClick = () => {
    renew.mutateAsync(debug ? DEBUG_DIST : dist?.name!).then(() => {
      setIsFirstTest(false)
    })
  }

  const handleSend = (data: Message) => {
    const id = dialogSession?.id!
    const message = data?.message!
    setMessage(message)

    send.mutate({ id, message })
    reset()
  }

  const send = useMutation({
    mutationFn: (variables: { id: number; message: string }) => {
      return sendMessage(variables?.id, variables?.message)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: 'history' }),
  })

  const handleRenewClick = () => {
    renew.mutateAsync(debug ? DEBUG_DIST : dist?.name!)
  }
  const renew = useMutation({
    mutationFn: (data: string) => {
      return renewDialog(data)
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: 'history' }),
        setDialogueSession(data)
    },
    onError: () => {
      setIsError(true)
    },
  })

  const handleTextAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(handleSend)
    }
  }
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [history])

  useObserver('RenewChat', handleRenewClick)

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
              <li role='tab' key='Dialog' aria-selected>
                Dialog
              </li>
            </ul>
          </>
        )}
      </SidePanelHeader>
      <div
        className={cx(
          'dialogSidePanel',
          startPanel && 'start',
          isError && 'error'
        )}>
        {isError && (
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
            <button onClick={handleStartBtnClick}>
              {renew.isLoading ? <TextLoader /> : 'Run Test'}
            </button>
          </>
        )}
        {chatPanel && (
          <>
            <div className={s.chat}>
              {history &&
                history?.map((block, i: number) => (
                  <div
                    key={`${block?.author == 'bot'}${i}`}
                    className={cx(
                      'chat__container',
                      block?.author == 'bot' && 'chat__container_bot'
                    )}>
                    <span
                      className={cx(
                        'chat__message',
                        block?.author == 'bot' && 'chat__message_bot'
                      )}>
                      {block?.text}
                    </span>
                  </div>
                ))}
              {send?.isLoading && (
                <>
                  <div className={`${s.chat__container}`}>
                    <span className={`${s.chat__message} `}>{message}</span>
                  </div>
                  <div className={cx('chat__container_bot', 'chat__container')}>
                    <span className={cx('chat__message', 'chat__message_bot')}>
                      <TextLoader />
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className={s.dialogSidePanel__controls}>
              <div className={s.left}>
                <DialogButton
                  active={isTextChat}
                  onClick={() => handleTypeBtnClick(TEXT_CHAT_TYPE)}>
                  <DialogTextIcon />
                </DialogButton>
                <button
                  className={s.dialogSidePanel__control}
                  onClick={handleDownloadBtnClick}>
                  <DownloadDialogIcon />
                </button>
              </div>
              <div className={s.right}>
                <Button
                  small
                  theme='secondary'
                  withIcon
                  props={{ onClick: handleRenewClick }}>
                  <div className={s['right-container']} data-tooltip-id='renew'>
                    <Renew />
                  </div>
                </Button>
              </div>
            </div>
            <form onSubmit={handleSubmit(handleSend)}>
              <textarea
                onKeyDown={handleTextAreaKeyDown}
                className={s.dialogSidePanel__textarea}
                placeholder='Type...'
                {...register('message')}
              />
              <input type='submit' hidden />
              <SidePanelButtons>
                <Button theme='primary' props={{ type: 'submit' }}>
                  Send
                </Button>
              </SidePanelButtons>
            </form>
          </>
        )}
      </div>
      <BaseToolTip id='renew' content='Start a new dialog' />
    </div>
  )
}

export default DialogSidePanel
