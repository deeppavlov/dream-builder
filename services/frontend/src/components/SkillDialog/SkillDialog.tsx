import { ReactComponent as DownloadDialogIcon } from '@assets/icons/dialog_download.svg'
import { ReactComponent as DialogMicrophoneIcon } from '@assets/icons/dialog_microphone.svg'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import classNames from 'classnames/bind'
import { FC, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { DEBUG_DIST } from '../../constants/constants'
import { useChat } from '../../hooks/useChat'
import { useChatScroll } from '../../hooks/useChatScroll'
import { useObserver } from '../../hooks/useObserver'
import { useOnlyOnMount } from '../../hooks/useOnMount'
import { ChatForm, SkillDialogProps } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { submitOnEnter } from '../../utils/submitOnEnter'
import DialogButton from '../DialogButton/DialogButton'
import TextLoader from '../TextLoader/TextLoader'
import s from './SkillDialog.module.scss'

export type ChatHistory = { text: string; author: 'bot' | 'me' }

const SkillDialog: FC<SkillDialogProps> = ({ dist, debug }) => {
  const { send, renew, session, message, history, error } = useChat()
  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const chatRef = useRef<HTMLUListElement>(null)
  const cx = classNames.bind(s)

  // handlers
  const handleSend = (data: ChatForm) => {
    const id = session?.id!
    const message = data?.message!
    send.mutate({ id, message })
    reset()
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))
  }
  const handleRenewClick = () => {
    renew.mutateAsync(debug ? DEBUG_DIST : dist?.name!)
  }

  // hooks
  useOnlyOnMount(() => renew.mutateAsync(debug ? DEBUG_DIST : dist?.name))
  useObserver('RenewChat', handleRenewClick)
  useChatScroll(chatRef, [history, message])

  return (
    <form
      onSubmit={handleSubmit(handleSend)}
      onKeyDown={handleKeyDown}
      className={s.dialog}
    >
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
                className={cx('msg', block?.author == 'bot' && 'bot')}
              >
                {block?.text}
              </li>
            )
          )}
          {send.isLoading && (
            <>
              <li className={cx('bot', 'msg')}>
                <TextLoader />
              </li>
            </>
          )}
        </ul>
      </div>
      <div className={s.controls}>
        <div className={s.left}>
          {/* <DialogButton active>
            <DialogTextIcon />
          </DialogButton>
          <DialogButton>
            <DialogMicrophoneIcon />
          </DialogButton>
          <div className={s.download}>
            <DialogButton>
              <DownloadDialogIcon />
            </DialogButton>
          </div> */}
        </div>
        <div className={s.right}>
          <Button
            small
            theme='secondary'
            withIcon
            props={{
              onClick: handleRenewClick,
            }}
          >
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
          props={{ disabled: send?.isLoading, type: 'submit' }}
        >
          Send
        </Button>
      </SidePanelButtons>
    </form>
  )
}

export default SkillDialog
