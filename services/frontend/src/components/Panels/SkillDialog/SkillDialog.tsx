import classNames from 'classnames/bind'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { ReactComponent as Renew } from 'assets/icons/renew.svg'
import {
  BotInfoInterface,
  ChatForm,
  IDialogError,
  ISkill,
  IUserApiKey,
} from 'types/types'
import { getUserId } from 'api/user'
import { useChat } from 'hooks/api'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import { useGaToken } from 'hooks/googleAnalytics/useGaToken'
import { useChatScroll } from 'hooks/useChatScroll'
import { useObserver } from 'hooks/useObserver'
import { chooseUniversalPrompted } from 'utils/chooseUniversalPrompted'
import { trigger } from 'utils/events'
import { getLSApiKeys } from 'utils/getLSApiKeys'
import { submitOnEnter } from 'utils/submitOnEnter'
import { Button } from 'components/Buttons'
import { TextLoader } from 'components/Loaders'
import { BaseToolTip } from 'components/Menus'
import SidePanelHeader from '../SidePanelHeader/SidePanelHeader'
import s from './SkillDialog.module.scss'

interface Props {
  isDebug: boolean
  distName: string | undefined
  skill: ISkill | null
  bot: BotInfoInterface | null | undefined
}

const SkillDialog = forwardRef(
  ({ isDebug, distName, skill, bot }: Props, ref) => {
    const { t } = useTranslation()
    const { send, renew, session, message, history } = useChat()
    const { data: user } = useQuery(['user'], () => getUserId())
    const { handleSubmit, register, reset } = useForm<ChatForm>()
    const [error, setError] = useState<IDialogError | null>(null)
    const [isChecking, setIsChecking] = useState(false)
    const apiKeyRef = useRef<{ [key: string]: string }>({})
    const chatRef = useRef<HTMLUListElement>(null)
    const cx = classNames.bind(s)
    const { skillChatRefresh, skillChatSend } = useGaSkills()
    const { setTokenState, missingTokenError } = useGaToken()

    const renewDialogSession = () => {
      const isDistName = distName !== undefined && distName?.length > 0

      if (!isDistName && !isDebug)
        return setError({
          type: 'dist-name',
          msg: 'The name of the assistant was not found.',
        })

      renew.mutateAsync(
        isDebug ? chooseUniversalPrompted(bot?.language?.value!) : distName!,
        {}
      )
    }

    const checkIsChatSettings = (userId: number) => {
      if (userId === undefined || userId === null) return
      setError(null)

      const lmApiKey = skill?.lm_service?.api_key

      if (lmApiKey && skill.lm_service) {
        const { name } = skill.lm_service
        const requiredApiKeyDisplayName = skill?.lm_service?.display_name
        const requiredKey = getLSApiKeys(userId)?.find(
          ({ api_service, lmUsageState }: IUserApiKey) => {
            return (
              api_service.display_name === lmApiKey.display_name &&
              lmUsageState[name]
            )
          }
        )

        if (!requiredKey) {
          setError({
            type: 'api-key',
            msg: t('api_key.required.skill_label', {
              service: requiredApiKeyDisplayName,
            }),
          })
          missingTokenError(
            'skill_editor_dialog_panel',
            skill?.lm_service?.api_key?.display_name
          )
          return false
        }
        apiKeyRef.current = { [lmApiKey.name]: requiredKey.token_value }
      }

      return true
    }

    // handlers
    const handleSend = ({ message }: ChatForm) => {
      const isMessage = message.replace(/\s/g, '').length > 0
      if (!isMessage) return

      const isChatSettings = checkIsChatSettings(user?.id)
      if (!isChatSettings) return
      send.mutate({
        dialog_session_id: session?.id!,
        text: message,
        lm_service_id: skill?.lm_service?.id,
        prompt: skill?.prompt,
        apiKeys: apiKeyRef.current,
      })
      skillChatSend(skill, history.length)

      reset()
    }

    const handleKeyDown = (e: React.KeyboardEvent) =>
      submitOnEnter(e, !send?.isLoading, handleSubmit(handleSend))

    const handleRenewClick = () => {
      skill && skillChatRefresh(skill)
      renewDialogSession()
    }

    const handleRetryBtnClick = () => {
      setIsChecking(true)
      setTimeout(() => {
        checkIsChatSettings(user?.id)
        setIsChecking(false)
      }, 1000)
    }

    const handleCheckChatSettings = () => {
      checkIsChatSettings(user?.id)
    }

    const handleEnterTokenClick = () => {
      skill &&
        setTokenState(
          'skill_editor_dialog_panel',
          skill?.lm_service?.api_key?.display_name
        )
      trigger('AccessTokensModal', {})
    }

    useChatScroll(chatRef, [history, message])
    useObserver('RenewChat', renewDialogSession)
    useObserver('AccessTokensChanged', handleCheckChatSettings, [
      user?.id,
      skill,
    ])
    useEffect(() => {
      bot && renewDialogSession()
    }, [])
    useEffect(() => handleCheckChatSettings(), [skill, user?.id])

    return (
      <form
        onSubmit={handleSubmit(handleSend)}
        onKeyDown={handleKeyDown}
        className={cx('dialog')}
        ref={ref as any}
      >
        <SidePanelHeader>
          <ul role='tablist'>
            <li role='tab' key='Dialog'>
              <span aria-selected>
                {t('sidepanels.skill_dialog.tabs.name')}
              </span>
            </li>
          </ul>
        </SidePanelHeader>
        {error?.type === 'api-key' && (
          <div className={s.error}>
            <span className={s.alertName}>
              {t('sidepanels.skill_dialog.error_header')}
            </span>
            <p className={s.alertDesc}>{error.msg}</p>
            {error.type === 'api-key' && (
              <div className={s.link}>
                <Button
                  theme='ghost'
                  props={{ onClick: handleEnterTokenClick }}
                >
                  {t('api_key.required.link')}
                </Button>
              </div>
            )}
            <Button
              theme='error'
              props={{ disabled: isChecking, onClick: handleRetryBtnClick }}
            >
              {t('sidepanels.skill_dialog.btns.retry')}
            </Button>
          </div>
        )}
        {error?.type !== 'api-key' && (
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
            <div className={s.bottom}>
              <div className={s['textarea-container']}>
                <textarea
                  className={s.textarea}
                  rows={4}
                  placeholder={t(
                    'sidepanels.skill_dialog.message_field.placeholder'
                  )}
                  {...register('message', { required: true })}
                  spellCheck='false'
                />
              </div>

              <div className={s.btns}>
                <Button
                  theme='secondary'
                  props={{
                    onClick: handleRenewClick,
                    disabled: send?.isLoading || !!error,
                    'data-tooltip-id': 'renew',
                  }}
                >
                  <Renew />
                </Button>
                <Button
                  theme='secondary'
                  props={{
                    disabled: send?.isLoading || !!error,
                    type: 'submit',
                  }}
                >
                  {t('sidepanels.skill_dialog.btns.send')}
                </Button>
              </div>
              <BaseToolTip id='renew' content={t('tooltips.dialog_renew')} />
            </div>
          </>
        )}
      </form>
    )
  }
)

export default SkillDialog
