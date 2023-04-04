import { ReactComponent as DownloadDialogIcon } from '@assets/icons/dialog_download.svg'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import classNames from 'classnames/bind'
import { FC, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DEBUG_DIST } from '../../constants/constants'
import { useChat } from '../../hooks/useChat'
import { useChatScroll } from '../../hooks/useChatScroll'
import { useObserver } from '../../hooks/useObserver'
import { BotInfoInterface, ChatForm } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { trigger } from '../../utils/events'
import { submitOnEnter } from '../../utils/submitOnEnter'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import DialogButton from '../DialogButton/DialogButton'
import TextLoader from '../TextLoader/TextLoader'
import s from './DialogSidePanel.module.scss'

const TEXT_CHAT_TYPE = 'text'
const VOICE_CHAT_TYPE = 'voice'

type ChatType = typeof TEXT_CHAT_TYPE | typeof VOICE_CHAT_TYPE
type ChatPanelType = 'bot' | 'skill'

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

const DialogSidePanel: FC<Props> = ({ start, chatWith, dist, debug }) => {
  const [chatType, setChatType] = useState<ChatType>(TEXT_CHAT_TYPE)
  const [isFirstTest, setIsFirstTest] = useState(start)
  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const { send, renew, session, message, history, error } = useChat()
  const chatRef = useRef<HTMLDivElement>(null)
  const isTextChat = chatType === TEXT_CHAT_TYPE
  const startPanel = isFirstTest && !error
  const chatPanel = !isFirstTest && !error
  const cx = classNames.bind(s)
  
  // handlers
  const handleTypeBtnClick = (type: ChatType) => setChatType(type)
  const handleDownloadBtnClick = () => {}
  const handleGoBackBtnClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }
  const handleStartBtnClick = () => {
    renew.mutateAsync(debug ? DEBUG_DIST : dist?.name!).then(() => {
      setIsFirstTest(false)
    })
  }
  const handleSend = (data: ChatForm) => {
    const id = session?.id!
    const message = data?.message!
    send.mutate({ id, message })
    reset()
  }
  const handleRenewClick = () => {
    renew.mutateAsync(debug ? DEBUG_DIST : dist?.name!)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))
  }

  // hooks
  useObserver('RenewChat', handleRenewClick)
  useChatScroll(chatRef, [history, message])

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
            <button onClick={handleStartBtnClick}>
              {renew.isLoading ? <TextLoader /> : 'Run Test'}
            </button>
          </>
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
            <div className={s.dialogSidePanel__controls}>
              <div className={s.left}>
                <DialogButton
                  active={isTextChat}
                  onClick={() => handleTypeBtnClick(TEXT_CHAT_TYPE)}
                >
                  <DialogTextIcon />
                </DialogButton>
                <button
                  className={s.dialogSidePanel__control}
                  onClick={handleDownloadBtnClick}
                >
                  <DownloadDialogIcon />
                </button>
              </div>
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
            </div>
            <form onKeyDown={handleKeyDown} onSubmit={handleSubmit(handleSend)}>
              <textarea
                className={s.dialogSidePanel__textarea}
                placeholder='Type...'
                {...register('message')}
              />
              <input type='submit' hidden />
              <SidePanelButtons>
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
      <BaseToolTip id='renew' content='Start a new dialog' />
    </div>
  )
}

export default DialogSidePanel
