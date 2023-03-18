import React, { useEffect, useRef, useState } from 'react'
import DeepyHelperIcon from '@assets/icons/deepy_helper.png'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DialogMicrophoneIcon } from '@assets/icons/dialog_microphone.svg'
import DialogButton from '../DialogButton/DialogButton'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import SidePanel from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './HelperDialogSidePanel.module.scss'

const TEXT_CHAT_TYPE = 'text'
const VOICE_CHAT_TYPE = 'voice'

type ChatType = typeof TEXT_CHAT_TYPE | typeof VOICE_CHAT_TYPE
interface ChatMessage {
  byBot: boolean
  text: string
}

interface Props {
  isOpen?: boolean
}

const HelperDialogSidePanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [chatType, setChatType] = useState<ChatType>(TEXT_CHAT_TYPE)
  const [chatHistory, setChatHistory] = useState<ChatMessage[] | []>([])
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  const handleTypeBtnClick = (type: ChatType) => setChatType(type)

  const handleSubmit = (e: React.MouseEvent) => {
    const userMessage = textAreaRef.current?.value
    if (!textAreaRef.current) return
    if (!userMessage && userMessage === '') return

    setChatHistory([...chatHistory, ...[{ byBot: false, text: userMessage! }]])
    textAreaRef.current.value = ''
  }

  const handleTrigger = (data: { detail: Props }) => {
    setIsOpen(data.detail.isOpen ?? !isOpen)
  }

  useEffect(() => {
    subscribe('HelperDialogSidePanel', handleTrigger)
    return () => unsubscribe('HelperDialogSidePanel', handleTrigger)
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatHistory])

  return (
    <SidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={{ left: 80, right: 'auto', bottom: 0 }}
      withTransition={false}
      key={'HelperDialogSidePanel'}>
      <div className={s.container}>
        <div className={s.dialogSidePanel}>
          <SidePanelHeader>
            <span className={s.header}>
              <img src={DeepyHelperIcon} alt='Deepy' className={s.deepy} />
              Deepy
            </span>
          </SidePanelHeader>
          <div className={s.chat} ref={chatRef}>
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
          <div className={s.dialogSidePanel__controls}>
            <DialogButton
              active={chatType === 'text'}
              onClick={() => handleTypeBtnClick(TEXT_CHAT_TYPE)}>
              <DialogTextIcon />
            </DialogButton>
            <DialogButton active={chatType === 'voice'}>
              <DialogMicrophoneIcon />
            </DialogButton>
          </div>
          <textarea
            ref={textAreaRef}
            className={s.dialogSidePanel__textarea}
            name='dialog'
            id='dialog'
            placeholder='Type...'
          />
          <SidePanelButtons>
            <Button theme='secondary' props={{ onClick: handleSubmit }}>
              Send
            </Button>
          </SidePanelButtons>
        </div>
      </div>
    </SidePanel>
  )
}

export default HelperDialogSidePanel
