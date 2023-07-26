import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { FC, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from 'react-query'
import { generatePath, useNavigate } from 'react-router-dom'
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg'
import { RoutesList } from 'router/RoutesList'
import { BotCardProps, TLocale } from 'types/types'
import { DEPLOY_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import { getDeploy } from 'api/deploy/getDeploy'
import { useAssistants } from 'hooks/api'
import { useGA } from 'hooks/useGA'
import { consts } from 'utils/consts'
import { dateToUTC } from 'utils/dateToUTC'
import { trigger } from 'utils/events'
import { getAssistantState } from 'utils/getAssistantState'
import { Button, Kebab } from 'components/Buttons'
import { AssistantContextMenu } from 'components/Menus'
import { AssistantSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Badge, SmallTag } from 'components/UI'
import s from './AssistantCard.module.scss'

export const AssistantCard: FC<BotCardProps> = ({
  type,
  bot,
  size,
  disabled,
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const tooltipId = useId()
  const { UIOptions } = useUIOptions()
  const queryClient = useQueryClient()
  const { refetchDist } = useAssistants()
  const { createVaFromTemplateButtonClick } = useGA()

  const activeAssistantId = UIOptions[consts.ACTIVE_ASSISTANT_SP_ID]
  const activeChat = UIOptions[consts.CHAT_SP_IS_ACTIVE]

  const infoSPId = `info_${bot.id}`
  const isActive =
    infoSPId === activeAssistantId ||
    bot.id === activeAssistantId ||
    bot.id === activeChat?.id
  const dateCreated = dateToUTC(
    new Date(bot?.date_created),
    i18n.language as TLocale
  )
  const { onModeration, isDeployed, isDeploying } = getAssistantState(bot)
  let cx = classNames.bind(s)

  const isPublished = bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
  const privateAssistant = bot?.visibility === VISIBILITY_STATUS.PRIVATE
  const unlistedAssistant = bot?.visibility === VISIBILITY_STATUS.UNLISTED_LINK

  const publishState = onModeration
    ? t('assistant_visibility.on_moderation')
    : isPublished
    ? t('assistant_visibility.public_template')
    : unlistedAssistant
    ? t('assistant_visibility.unlisted')
    : privateAssistant
    ? t('assistant_visibility.private')
    : null

  const handleBotCardClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: activeAssistantId !== infoSPId,
      children: (
        <AssistantSidePanel
          type={type}
          key={bot?.id}
          name={bot.name}
          disabled={disabled}
        />
      ),
    })
  }

  const handleCloneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createVaFromTemplateButtonClick('va_templates_block', 'card', {
      id: bot.id,
      name: bot.display_name,
      authorId: bot.author.id,
      authorName: bot.author.fullname || 'none',
    })

    const assistantClone = { action: 'clone', bot: bot }

    if (!disabled) {
      e.stopPropagation()
      return trigger('AssistantModal', assistantClone)
    }

    trigger('SignInModal', {
      requestModal: { name: 'AssistantModal', options: assistantClone },
    })

    e.stopPropagation()
  }

  const handlEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    isPublished
      ? trigger('PublicToPrivateModal', { bot, action: 'edit' })
      : navigate(generatePath(RoutesList.editor.skills, { name: bot?.name }))
    e.stopPropagation()
  }

  const status = useQuery({
    queryKey: ['deploy', bot?.deployment?.id],
    queryFn: () => getDeploy(bot?.deployment?.id!),
    refetchOnMount: false,
    enabled:
      bot?.deployment?.id !== undefined &&
      type !== 'public' &&
      bot?.deployment?.state !== DEPLOY_STATUS.UP,
    onSuccess(data) {
      if (data?.state === DEPLOY_STATUS.UP) {
        queryClient.invalidateQueries(['privateDists'])
        refetchDist.mutateAsync(bot?.name)
      }
      if (
        data?.state !== DEPLOY_STATUS.UP &&
        data?.state !== null &&
        data?.error == null
      ) {
        setTimeout(() => {
          queryClient.invalidateQueries(['deploy', data?.id])
        }, 5000)
      } else if (data?.error !== null) {
        console.log('error')
      }
    },
  })

  return (
    <div
      className={cx('assistantCard', `${type}`, size)}
      onClick={handleBotCardClick}
      data-active={isActive}
    >
      {type === 'your' && isDeployed && <Badge />}
      <div className={cx('header', isDeploying && 'deploying')}>
        <span>{bot?.display_name}</span>
      </div>
      <div className={s.body}>
        <div className={s.block}>
          <div className={s.desc} data-tooltip-id={'botCardDesc' + bot?.name}>
            {bot?.description}
          </div>
          <div className={s.dateAndVersion}>
            <div className={s.date}>
              <CalendarIcon />
              {dateCreated}
            </div>
            <SmallTag theme={onModeration ? 'validating' : bot?.visibility}>
              {publishState}
            </SmallTag>
          </div>
        </div>
        <div className={s.btns}>
          {type === 'public' ? (
            <>
              <div
                data-tip
                data-tooltip-id={'botClone' + bot?.name}
                className={s.container}
              >
                <Button
                  theme='primary'
                  small
                  long
                  props={{ onClick: handleCloneClick }}
                >
                  {t('card_btns.use')}
                </Button>
              </div>
              <Kebab tooltipId={tooltipId} theme='card' />
              <AssistantContextMenu
                tooltipId={tooltipId}
                bot={bot}
                type={type}
                isDeployed={isDeployed}
              />
            </>
          ) : (
            <>
              <Button
                theme='primary'
                small
                long
                props={{
                  onClick: handlEditClick,
                  disabled: onModeration || isDeploying,
                }}
              >
                {t('card_btns.edit')}
              </Button>
              <Kebab tooltipId={tooltipId} theme='card' />
              <AssistantContextMenu
                tooltipId={tooltipId}
                bot={bot}
                type={type}
                isDeployed={isDeployed}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
