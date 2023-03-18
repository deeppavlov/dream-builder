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
import classNames from 'classnames/bind'
import s from './DialogSidePanel.module.scss'

const TEXT_CHAT_TYPE = 'text'
const VOICE_CHAT_TYPE = 'voice'

type ChatType = typeof TEXT_CHAT_TYPE | typeof VOICE_CHAT_TYPE

interface props {
  error?: boolean
  start?: boolean
}
interface DialogSessionConfig {
  id: number
  is_active: boolean
  user_id: boolean
  virtual_assistant_id: number
}
type Message = { message: string }
const DialogSidePanel = ({ error, start }: props) => {
  const [chatType, setChatType] = useState<ChatType>(TEXT_CHAT_TYPE)
  const [chatHistory, setChatHistory] = useState([])
  const [isError, setIsError] = useState(error ?? false)
  const [isFirstTest, setIsFirstTest] = useState(start ?? chatHistory === null)
  const isTextChat = chatType === TEXT_CHAT_TYPE
  const isVoiceChat = chatType === VOICE_CHAT_TYPE
  const { handleSubmit, register, reset, getFieldState, getValues } = useForm()
  const queryClient = useQueryClient()

  const handleTypeBtnClick = (type: ChatType) => setChatType(type)
  const handleDownloadBtnClick = () => {}
  const handleGoBackBtnClick = () => trigger(BASE_SP_EVENT, { isOpen: false })

  const handleStartBtnClick = () => {
    renew.mutateAsync().then(() => {
      setIsFirstTest(false)
    })
  }

  const [message, setMessage] = useState('')
  const handleSend = (data: Message) => {
    const id = dialogSession?.id!
    const message = data?.message!
    setMessage(message)
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
      queryClient.invalidateQueries({ queryKey: 'history' }),
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
            <span className={s.alerName}>Alert!</span>
            <p className={s.alertDesc}>
              Check the settings of your bot. Something went wrong!
            </p>
            <button onClick={handleGoBackBtnClick}>Go back</button>
          </>
        )}
        {startPanel && (
          <>
            <span className={s.alerName}>Run your bot</span>
            <p className={s.alertDesc}>
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
                    key={`${block.author == 'bot'}${index}`}
                    className={`${s.chat__container} ${
                      block.author == 'bot' && s.chat__container_bot
                    }`}>
                    <span
                      className={`${s.chat__message} ${
                        block.author == 'bot' && s.chat__message_bot
                      }`}>
                      {block.text}
                    </span>
                  </div>
                ))}
                {send?.isLoading && (
                  <>
                    <div className={`${s.chat__container}`}>
                      <span className={`${s.chat__message} `}>{message}</span>
                    </div>
                  </>
                )}
              </div>
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
                  <div className={s.container} data-tooltip-id='renew'>
                    <Renew />
                  </div>
                </Button>
              </div>
            </div>
            <form onSubmit={handleSubmit(handleSend)}>
              <textarea
                className={s.dialogSidePanel__textarea}
                placeholder='Type...'
                {...register('message')}
              />
              <input type='submit' hidden />
              <div className={s.dialogSidePanel__btns}>
                <button type='submit'>Send</button>
              </div>
            </form>
          </>
        )}
      </div>
      <BaseToolTip id='renew' content='Start a new dialog' />
    </>
  )
}

export default DialogSidePanel
