import classNames from 'classnames/bind'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DialogMicrophoneIcon } from '@assets/icons/dialog_microphone.svg'
import { ReactComponent as DownloadDialogIcon } from '@assets/icons/dialog_download.svg'
import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import DialogButton from '../DialogButton/DialogButton'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import { SessionConfig, SkillDialogProps } from '../../types/types'
import { useState, useRef, useEffect, FC } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient, useQuery, useMutation } from 'react-query'
import { getHistory } from '../../services/getHistory'
import { renewDialog } from '../../services/renewDialog'
import { sendMessage } from '../../services/sendMessage'
import { subscribe, unsubscribe } from '../../utils/events'
import TextLoader from '../TextLoader/TextLoader'
import s from './SkillDialog.module.scss'

export const DEBUG_DIST = 'universal_prompted_assistant'

const SkillDialog: FC<SkillDialogProps> = ({ error, start, dist, debug }) => {
  const [isError, setIsError] = useState(error ?? false)
  const [isFirstTest, setIsFirstTest] = useState(start)
  const [message, setMessage] = useState<string>('')
  const { handleSubmit, register, reset } = useForm()
  const [session, setSession] = useState<SessionConfig | null>(null)
  const queryClient = useQueryClient()
  const chatRef = useRef<HTMLDivElement>(null)
  const cx = classNames.bind(s)

  const { data: history } = useQuery(
    ['history', session?.id],
    () => getHistory(session?.id!),
    {
      enabled: !!message,
    }
  )

  const handleSend = (data: any) => {
    const id = session?.id!
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
      queryClient.invalidateQueries({ queryKey: 'history' }), setSession(data)
    },
    onError: () => {
      setIsError(true)
    },
  })

  const handleTextAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(handleSend)()
    }
  }
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    renew.mutateAsync(dist?.name)
    subscribe('RenewChat', handleRenewClick)
    return () => unsubscribe('RenewChat', handleRenewClick)
  }, [])

  return (
    <form
      onSubmit={handleSubmit(handleSend)}
      onKeyDown={handleTextAreaKeyDown}
      className={s.dialog}>
      <SidePanelHeader>
        <ul role='tablist'>
          <li role='tab' key='Current  Skill' aria-selected>
            Current Skill
          </li>
          <li role='tab' key='All Skills'>
            All Skills
          </li>
        </ul>
      </SidePanelHeader>

      <div className={s.container}>
        <ul className={s.chat}>
          {history &&
            history?.map(
              (block: { author: string; text: string }, i: number) => (
                <li
                  key={`${block?.author == 'bot'}${i}`}
                  className={cx('msg', block?.author == 'bot' && 'bot')}>
                  {block?.text}
                </li>
              )
            )}
          {send?.isLoading && (
            <>
              <li className={s.msg}>{message}</li>
              <li className={cx('bot', 'msg')}>
                <TextLoader />
              </li>
            </>
          )}
        </ul>
      </div>
      <div className={s.controls}>
        <div className={s.left}>
          <DialogButton active>
            <DialogTextIcon />
          </DialogButton>
          <DialogButton>
            <DialogMicrophoneIcon />
          </DialogButton>
          <div className={s.download}>
            <DialogButton>
              <DownloadDialogIcon />
            </DialogButton>
          </div>
        </div>
        <div className={s.right}>
          <Button
            small
            theme='secondary'
            withIcon
            props={{
              onClick: handleRenewClick,
            }}>
            <div className={s['right-container']} data-tooltip-id='renew'>
              <Renew />
            </div>
          </Button>
        </div>
      </div>
      <div className={cx('textarea-container')}>
        <textarea
          onKeyDown={handleTextAreaKeyDown}
          className={s.textarea}
          rows={4}
          placeholder='Type...'
          {...register('message')}
        />
      </div>
      <SidePanelButtons>
        <Button theme='secondary' props={{ type: 'submit' }}>
          Send
        </Button>
      </SidePanelButtons>
    </form>
  )
}

export default SkillDialog
