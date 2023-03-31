import { useState, useRef, useEffect, FC } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient, useQuery, useMutation } from 'react-query'
import classNames from 'classnames/bind'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DialogMicrophoneIcon } from '@assets/icons/dialog_microphone.svg'
import { ReactComponent as DownloadDialogIcon } from '@assets/icons/dialog_download.svg'
import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import DialogButton from '../DialogButton/DialogButton'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { ChatForm, SessionConfig, SkillDialogProps } from '../../types/types'
import { getHistory } from '../../services/getHistory'
import { renewDialog } from '../../services/renewDialog'
import { sendMessage } from '../../services/sendMessage'
import TextLoader from '../TextLoader/TextLoader'
import { useObserver } from '../../hooks/useObserver'
import { useChatScroll } from '../../hooks/useChatScroll'
import { submitOnEnter } from '../../utils/submitOnEnter'
import { useOnlyOnMount } from '../../hooks/useOnlyOnMount'
import s from './SkillDialog.module.scss'

export const DEBUG_DIST = 'universal_prompted_assistant'

const SkillDialog: FC<SkillDialogProps> = ({ error, dist, debug }) => {
  const [isError, setIsError] = useState(error ?? false)
  const [message, setMessage] = useState<string>('')
  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const [session, setSession] = useState<SessionConfig | null>(null)
  const queryClient = useQueryClient()
  const chatRef = useRef<HTMLUListElement>(null)
  const cx = classNames.bind(s)
  // handlers
  const handleSend = (data: ChatForm) => {
    const id = session?.id!
    const message = data?.message!
    setMessage(message)
    send.mutate({ id, message })
    reset()
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))
  }
  const handleRenewClick = () => {
    renew.mutateAsync(debug ? DEBUG_DIST : dist?.name!)
    setMessage('')
  }
  // queries
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
  const send = useMutation({
    mutationFn: (variables: { id: number; message: string }) => {
      return sendMessage(variables?.id, variables?.message)
    },
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: 'history' }),
  })
  const { data: history } = useQuery(
    ['history', session?.id],
    () => getHistory(session?.id!),
    { refetchOnWindowFocus: false, enabled: send?.isLoading }
  )
  // hooks
  useOnlyOnMount(() => renew.mutateAsync(dist?.name))
  useObserver('RenewChat', handleRenewClick)
  useChatScroll(chatRef, [history, message])

  return (
    <form
      onSubmit={handleSubmit(handleSend)}
      onKeyDown={handleKeyDown}
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
        <ul ref={chatRef} className={s.chat}>
          {history?.map(
            (block: { author: string; text: string }, i: number) => (
              <li
                key={`${block?.author == 'bot'}${i}`}
                className={cx('msg', block?.author == 'bot' && 'bot')}>
                {block?.text}
              </li>
            )
          )}
          {send.isLoading && (
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
          className={s.textarea}
          rows={4}
          placeholder='Type...'
          {...register('message')}
        />
      </div>
      <SidePanelButtons>
        <Button
          theme='secondary'
          props={{ disabled: send?.isLoading, type: 'submit' }}>
          Send
        </Button>
      </SidePanelButtons>
    </form>
  )
}

export default SkillDialog
