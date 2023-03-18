import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DownloadDialogIcon } from '@assets/icons/download_dialog.svg'
import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import { trigger } from '../../utils/events'
import DialogButton from '../DialogButton/DialogButton'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import Button from '../../ui/Button/Button'
import { getHistory } from '../../services/getHistory'
import { sendMessage } from '../../services/sendMessage'
import { renewDialog } from '../../services/renewDialog'
import s from './DialogSidePanel.module.scss'
import classNames from 'classnames/bind'

const TEXT_CHAT_TYPE = 'text'
const VOICE_CHAT_TYPE = 'voice'

type ChatType = typeof TEXT_CHAT_TYPE | typeof VOICE_CHAT_TYPE

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
  const { handleSubmit, register, reset } = useForm()
  const queryClient = useQueryClient()

  const handleTypeBtnClick = (type: ChatType) => setChatType(type)
  const handleDownloadBtnClick = () => {}
  const handleGoBackBtnClick = () => trigger(BASE_SP_EVENT, { isOpen: false })

  const handleSubmit = (e: React.MouseEvent) => {
    const userMessage = textAreaRef.current?.value
    if (!textAreaRef.current) return
    if (!userMessage && userMessage === '') return

    setChatHistory([...chatHistory, ...[{ byBot: false, text: userMessage! }]])
    textAreaRef.current.value = ''
  }

  const handleSend = (data: Message) => {
    const id = dialogSession?.id!
    const message = data?.message!
    send.mutate({ id, message })
    reset()
  }
  const handleRenewClick = () => {
    renew.mutateAsync().then()
  }

  const [dialogSession, setDialogueSession] =
    useState<DialogSessionConfig | null>(null)

  const {
    data: history,
    isLoading: isHistoryLoading,
    isError: historyError,
  } = useQuery(['history', dialogSession?.id], () =>
    getHistory(dialogSession?.id!)
  )

  const send = useMutation({
    mutationFn: (variables: { id: number; message: string }) => {
      return sendMessage(variables?.id, variables?.message)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: 'history' }),
  })

  const renew = useMutation({
    mutationFn: () => {
      return renewDialog()
    },
    onSuccess: data => {
      setDialogueSession(data)
    },
  })

  const cx = classNames.bind(s)
  const startPanel = isFirstTest && !isError
  const chatPanel = !isFirstTest && !isError
  return (
    <>
      <SidePanelHeader>Dialog</SidePanelHeader>
      <div
        className={cx(
          'dialogSidePanel',
          startPanel && 'start',
          isError && 'error'
        )}>
        {isError && (
          <>
            <span className={s['dialogSidePanel__alert-name']}>Alert!</span>
            <p className={s['dialogSidePanel__alert-desc']}>
              Check the settings of your bot. Something went wrong!
            </p>
            <button onClick={handleGoBackBtnClick}>Go back</button>
          </>
        )}
        {startPanel && (
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
        {chatPanel && (
          <>
            <div className={s['dialogSidePanel__chat']}>
              <div className={s.chat}>
                {history?.map((block, index) => (
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
