import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import classNames from 'classnames/bind'
import { FC,useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useChat } from '../../../hooks/useChat'
import { ChatForm } from '../../../types/types'
import Button from '../../../ui/Button/Button'
import SidePanelButtons from '../../../ui/SidePanelButtons/SidePanelButtons'
import { trigger } from '../../../utils/events'
import { submitOnEnter } from '../../../utils/submitOnEnter'
import { validationSchema } from '../../../utils/validationSchema'
import TextLoader from '../../TextLoader/TextLoader'
import s from '../DialogSidePanel.module.scss'

export const ChatPanel: FC = () => {
  const cx = classNames.bind(s)
  const chatRef = useRef<HTMLDivElement>(null)
  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const { send, renew, session, message, history, error } = useChat()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))
  }
  const handleSend = (data: ChatForm) => {
    console.log('session = ', session)
    const id = session?.id!
    const message = data?.message!
    send.mutate({ dialog_session_id: id, text: message })
    reset()
  }
  const handleRenewClick = () => trigger('RenewChat', {})

  return (
    <>
      <div className={s.chat} ref={chatRef}>
        {history?.map((block: { author: string; text: string }, i: number) => (
          <div
            key={`${block?.author == 'bot'}${i}`}
            className={cx(
              'chat__container',
              block?.author == 'bot' && 'chat__container_bot'
            )}
          >
            <span
              className={cx(
                'chat__message',
                block?.author == 'bot' && 'chat__message_bot'
              )}
            >
              {block?.text}
            </span>
          </div>
        ))}
        {send?.isLoading && (
          <>
            <div className={cx('chat__container_bot', 'chat__container')}>
              <span className={cx('chat__message', 'chat__message_bot')}>
                <TextLoader />
              </span>
            </div>
          </>
        )}
      </div>
      <form onKeyDown={handleKeyDown} onSubmit={handleSubmit(handleSend)}>
        <textarea
          className={s.dialogSidePanel__textarea}
          placeholder='Type...'
          {...register('message', {
            required: validationSchema.global.required,
          })}
        />
        <input type='submit' hidden />
        <SidePanelButtons>
          <Button
            theme='secondary'
            props={{
              onClick: handleRenewClick,
            }}
          >
            <Renew data-tooltip-id='renew' />
          </Button>
          <Button
            theme='primary'
            props={{ disabled: send?.isLoading, type: 'submit' }}
          >
            Send
          </Button>
        </SidePanelButtons>
      </form>
    </>
  )
}
