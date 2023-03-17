import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DownloadDialogIcon } from '@assets/icons/download_dialog.svg'
import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import DialogButton from '../DialogButton/DialogButton'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { trigger } from '../../utils/events'
import classNames from 'classnames/bind'
import Button from '../../ui/Button/Button'
import s from './DialogSidePanel.module.scss'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getHistory } from '../../services/getHistory'
import { useForm } from 'react-hook-form'
import { sendMessage } from '../../services/sendMessage'
import { renewDialog } from '../../services/renewDialog'
import { Loader } from '../Loader/Loader'

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
  const { handleSubmit, register, reset } = useForm()
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm()

  const handleTypeBtnClick = (type: ChatType) => setChatType(type)
  const handleDownloadBtnClick = () => {}
  const handleGoBackBtnClick = () => trigger(BASE_SP_EVENT, { isOpen: false })

  const handleStartBtnClick = () => {
    renew.mutateAsync().then(() => {
      setIsFirstTest(false)
    })
  }

  const handleGoBackBtnClick = () => trigger(BASE_SP_EVENT, { isOpen: false })

  const {
    data: history,
    isLoading: isHistoryLoading,
    isError: historyError,
  } = useQuery(['history', dialogSession?.id], () =>
    getHistory(dialogSession?.id!)
  )

  const handleSend = (data: Message) => {
    const id = dialogSession?.id!
    const message = data?.message!
    send.mutate({ id, message })
    reset()
  }

  const queryClient = useQueryClient()

  const [dialogSession, setDialogueSession] =
    useState<DialogSessionConfig | null>(null)

  const {
    data: history,
    isLoading: isHistoryLoading,
    isError: historyError,
  } = useQuery(['history', dialogSession?.id], () =>
    getHistory(dialogSession?.id!)
  )

  // history && setChatHistory(history)
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

  const handleRenewClick = () => {
    renew.mutateAsync().then()
  }
  const cx = classNames.bind(s)

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
                {/* {history?.map(block => {
                  return (
                    <span
                      className={`${s.chat__message} ${
                        block.author == 'bot' && s.chat__message_bot
                      }`}>
                      {block.text}
                    </span>
                  )
                })} */}

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
                {/* {isHistoryLoading ? message : history} */}
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
