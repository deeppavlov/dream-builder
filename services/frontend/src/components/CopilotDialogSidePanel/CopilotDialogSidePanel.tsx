import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import DialogButton from '../DialogButton/DialogButton'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import SidePanel from '../../ui/SidePanel/SidePanel'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './CopilotDialogSidePanel.module.scss'

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

const CopilotDialogSidePanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [chatType, setChatType] = useState<ChatType>(TEXT_CHAT_TYPE)
  const [chatHistory, setChatHistory] = useState<ChatMessage[] | []>([])
  const isTextChat = chatType === TEXT_CHAT_TYPE
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

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
    subscribe('CopilotDialogSidePanel', handleTrigger)
    return () => unsubscribe('CopilotDialogSidePanel', handleTrigger)
  }, [])

  return (
    <SidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={{ left: 0, right: 'auto', bottom: 0 }}
      withTransition={false}
      key={'CopilotDialog'}>
      <div className={s.container}>
        <SidePanelHeader>
          <ul role='tablist'>
            <li role='tab' key='Copilot' aria-selected>
              Copilot
            </li>
          </ul>
        </SidePanelHeader>
        <div className={s.dialogSidePanel}>
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
      </div>
    </SidePanel>
  )
}

export default CopilotDialogSidePanel
