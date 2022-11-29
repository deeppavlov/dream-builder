import React, { useRef, useState } from 'react'
import Modal from 'react-modal'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import DialogButton from '../DialogButton/DialogButton'
import s from './DialogSidePanel.module.scss'

const customStyles = {
  overlay: {
    background: 'transparent',
  },
  content: {
    top: 64,
    left: 'fit-with',
    right: '0',
    bottom: '0',
    border: 'none',
    background: 'transparent',
    borderRadius: 'none',
    padding: 'none',
  },
}

const TEXT_CHAT_TYPE = 'text'
const VOICE_CHAT_TYPE = 'voice'

type ChatType = typeof TEXT_CHAT_TYPE | typeof VOICE_CHAT_TYPE
interface ChatMessage {
  byBot: boolean
  text: string
}
type props = {
  isOpen: boolean
  setIsOpen: Function
}

const DialogSidePanel = ({ isOpen, setIsOpen }: props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [chatType, setChatType] = useState<ChatType>(TEXT_CHAT_TYPE)
  const [chatHistory, setChatHistory] = useState<ChatMessage[] | []>([
    { byBot: false, text: 'Hello!' },
    { byBot: true, text: 'Hi! This is a Dream Socialbot.   How are you?' },
  ])
  const [isError, setIsError] = useState(false)

  const isTextChat = chatType === TEXT_CHAT_TYPE
  const isVoiceChat = chatType === VOICE_CHAT_TYPE
  const isFirstTest = chatHistory === null

  const closeModal = () => setIsOpen(false)
  const handleChatTypeBtn = (type: ChatType) => setChatType(type)
  const handleSubmit = (e: React.MouseEvent) => {
    const userMessage = textAreaRef.current?.value
    if (!textAreaRef.current) return
    if (!userMessage && userMessage === '') return

    setChatHistory([...chatHistory, ...[{ byBot: false, text: userMessage! }]])
    textAreaRef.current.value = ''
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel='Test Dialog'>
      <div className={s.dialogSidePanel}>
        <div className={s.dialogSidePanel__title}>
          <span>Dialog</span>
          <CloseIcon
            className={s.dialogSidePanel__close}
            onClick={closeModal}
          />
        </div>
        <div className={s['dialogSidePanel__chat-box']}>
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
            onClick={() => handleChatTypeBtn(TEXT_CHAT_TYPE)}>
            <DialogTextIcon />
          </DialogButton>
          {/* <DialogButton
            active={isVoiceChat}
            onClick={() => handleChatTypeBtn(VOICE_CHAT_TYPE)}>
            <DialogMicrophoneIcon />
          </DialogButton> */}
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
      </div>
    </Modal>
  )
}

export default DialogSidePanel
