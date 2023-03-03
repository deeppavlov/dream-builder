import React, { useRef, useState } from 'react'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DownloadDialogIcon } from '@assets/icons/download_dialog.svg'
import DialogButton from '../DialogButton/DialogButton'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { trigger } from '../../utils/events'
import s from './DialogSidePanel.module.scss'

const TEXT_CHAT_TYPE = 'text'
const VOICE_CHAT_TYPE = 'voice'

type ChatType = typeof TEXT_CHAT_TYPE | typeof VOICE_CHAT_TYPE
interface ChatMessage {
  byBot: boolean
  text: string
}
interface props {
  error?: boolean
  start?: boolean
}

const DialogSidePanel = ({ error, start }: props) => {
  const [chatType, setChatType] = useState<ChatType>(TEXT_CHAT_TYPE)
  const [chatHistory, setChatHistory] = useState<ChatMessage[] | []>([
    { byBot: false, text: 'Hello!' },
    { byBot: true, text: 'Hi! This is a Dream Socialbot. How are you?' },
  ])
  const [isError, setIsError] = useState(error ?? false)
  const [isFirstTest, setIsFirstTest] = useState(start ?? chatHistory === null)
  const isTextChat = chatType === TEXT_CHAT_TYPE
  const isVoiceChat = chatType === VOICE_CHAT_TYPE
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleTypeBtnClick = (type: ChatType) => setChatType(type)

  const handleSubmit = (e: React.MouseEvent) => {
    const userMessage = textAreaRef.current?.value
    if (!textAreaRef.current) return
    if (!userMessage && userMessage === '') return

    setChatHistory([...chatHistory, ...[{ byBot: false, text: userMessage! }]])
    textAreaRef.current.value = ''
  }

  const handleStartBtnClick = () => setIsFirstTest(false)

  const handleGoBackBtnClick = () => trigger(BASE_SP_EVENT, { isOpen: false })

  const handleDownloadBtnClick = () => {}

  return (
    <>
      <SidePanelHeader>Dialog</SidePanelHeader>
      <div
        className={`${s.dialogSidePanel} ${
          isFirstTest && !isError && s.dialogSidePanel_start
        } ${isError && s.dialogSidePanel_error}`}>
        {isError && (
          <>
            <span className={s['dialogSidePanel__alert-name']}>Alert!</span>
            <p className={s['dialogSidePanel__alert-desc']}>
              Check the settings of your bot. Something went wrong!
            </p>
            <button onClick={handleGoBackBtnClick}>Go back</button>
          </>
        )}
        {isFirstTest && !isError && (
          <>
            <span className={s['dialogSidePanel__alert-name']}>
              Run your bot
            </span>
            <p className={s['dialogSidePanel__alert-desc']}>
              Start a test to interact with your bot using text, voice or
              buttons
            </p>
            <button onClick={handleStartBtnClick}>Run Test</button>
          </>
        )}
        {!isFirstTest && !isError && (
          <>
            <div className={s['dialogSidePanel__chat']}>
              <div className={s.chat}>
                {chatHistory?.map((m, index) => (
                  <div
                    key={`${m.byBot}${index}`}
                    className={`${s.chat__container} ${
                      m.byBot && s.chat__container_bot
                    }`}>
                    {m.byBot && <span className={s.chat__avatar}></span>}
                    <span
                      className={`${s.chat__message} ${
                        m.byBot && s.chat__message_bot
                      }`}>
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className={s.dialogSidePanel__controls}>
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
            <textarea
              ref={textAreaRef}
              className={s.dialogSidePanel__textarea}
              name='dialog'
              id='dialog'
              placeholder='Type...'
            />
            <div className={s.dialogSidePanel__btns}>
              {/* Change to onSubmit, maybe need to wrap TextArea and button in to HTML Form */}
              <button onClick={handleSubmit}>Send</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default DialogSidePanel
