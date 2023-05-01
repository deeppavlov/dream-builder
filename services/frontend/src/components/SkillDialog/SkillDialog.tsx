import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import classNames from 'classnames/bind'
import { FC, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { DEBUG_DIST } from '../../constants/constants'
import { useChat } from '../../hooks/useChat'
import { useChatScroll } from '../../hooks/useChatScroll'
import { useObserver } from '../../hooks/useObserver'
import { useOnlyOnMount } from '../../hooks/useOnMount'
import { RoutesList } from '../../router/RoutesList'
import { getUserId } from '../../services/getUserId'
import { ChatForm, SkillDialogProps } from '../../types/types'
import Button from '../../ui/Button/Button'
import { getLSApiKeyByName } from '../../utils/getLSApiKeys'
import { submitOnEnter } from '../../utils/submitOnEnter'
import { checkOpenAiType } from '../SkillPromptModal/SkillPromptModal'
import TextLoader from '../TextLoader/TextLoader'
import s from './SkillDialog.module.scss'

export type ChatHistory = { text: string; author: 'bot' | 'me' }

const OPEN_AI = 'OpenAI'

const SkillDialog: FC<SkillDialogProps> = ({
  dist,
  debug,
  lm_service,
  prompt,
}) => {
  const { send, renew, session, message, history } = useChat()
  const { handleSubmit, register, reset } = useForm<ChatForm>()
  const chatRef = useRef<HTMLUListElement>(null)
  const { data: user } = useQuery(['user'], () => getUserId())
  const cx = classNames.bind(s)
  const isOpenAi = checkOpenAiType(lm_service?.name || '')
  const api_token = getLSApiKeyByName(user?.id, OPEN_AI)
  const isApiToken =
    api_token !== null && api_token !== undefined && api_token.length > 0
  const isError = isOpenAi && !isApiToken

  // handlers
  const handleSend = (data: ChatForm) => {
    const id = session?.id!
    const message = data?.message!

    send.mutate({
      dialog_session_id: id,
      text: message,
      lm_service_id: lm_service?.id,
      prompt,
      openai_api_key: api_token ?? undefined,
    })
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
      className={cx('dialog', isError && 'error')}
    >
      {isError && (
        <>
          <span className={s.alertName}>Error!</span>
          <p className={s.alertDesc}>
            {!isApiToken &&
              'Enter your personal access token for OpenAI to run your Generative AI Skill'}
          </p>
          {!isApiToken && (
            <Link className={s.link} to={RoutesList.profile}>
              Enter your personal access token here
            </Link>
          )}
          <button>Try again</button>
        </>
      )}
      {!isError && (
        <>
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

          {/* <div className={s.controls}>
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
            }}
          >
            <div className={s['right-container']} data-tooltip-id='renew'>
              <Renew />
            </div>
          </Button>
        </div>
      </div> */}

          <div className={s.bottom}>
            <div className={s['textarea-container']}>
              <textarea
                className={s.textarea}
                rows={4}
                placeholder='Type...'
                {...register('message')}
              />
            </div>

            <div className={s.btns}>
              <Button
                theme='secondary'
                props={{
                  onClick: handleRenewClick,
                }}
              >
                <Renew data-tooltip-id='renew' />
              </Button>
              <Button
                theme='secondary'
                props={{ disabled: send?.isLoading, type: 'submit' }}
              >
                Send
              </Button>
            </div>
          </div>
        </>
      )}
    </form>
  )
}

export default SkillDialog
