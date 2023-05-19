import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import classNames from 'classnames/bind'
import { FC, useId } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  PublishRequestsStatus,
  VisibilityStatus,
} from '../../constants/constants'
import { useDisplay } from '../../context/DisplayContext'
import { getDeploy } from '../../services/getDeploy'
import { BotCardProps } from '../../types/types'
import Button from '../../ui/Button/Button'
import { Kebab } from '../../ui/Kebab/Kebab'
import { consts } from '../../utils/consts'
import { dateToUTC } from '../../utils/dateToUTC'
import { trigger } from '../../utils/events'
import AssistantContextMenu from '../AssistantContextMenu/AssistantContextMenu'
import AssistantSidePanel from '../AssistantSidePanel/AssistantSidePanel'
import { Badge } from '../Badge/Badge'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './AssistantCard.module.scss'

export const AssistantCard: FC<BotCardProps> = ({
  type,
  bot,
  size,
  disabled,
}) => {
  const navigate = useNavigate()
  const tooltipId = useId()
  const { options } = useDisplay()
  const activeAssistantId = options.get(consts.ACTIVE_ASSISTANT_SP_ID)
  const infoSPId = `info_${bot.id}`
  const isActive =
    infoSPId === activeAssistantId || bot.id === activeAssistantId
  const dateCreated = dateToUTC(new Date(bot?.date_created))
  let cx = classNames.bind(s)

  const onModeration = bot?.publish_state === PublishRequestsStatus.IN_REVIEW
  const isPublished = bot?.visibility === VisibilityStatus.PUBLIC_TEMPLATE
  const privateAssistant = bot?.visibility === VisibilityStatus.PRIVATE
  const unlistedAssistant = bot?.visibility === VisibilityStatus.UNLISTED_LINK
  const isDeployed = bot?.deployment?.state === 'UP'
  const isDeploying =
    !isDeployed && bot?.deployment?.state !== null && bot?.deployment !== null
  const publishState = onModeration
    ? 'On Moderation'
    : isPublished
    ? 'Public Template'
    : unlistedAssistant
    ? 'Unlisted'
    : privateAssistant
    ? 'Private'
    : null

  // const publishState = !bot?.publish_state
  //   ? type === 'your' && bot?.visibility
  //   : onModeration
  //   ? 'On Moderation'
  //   : published
  //   ? 'Public Template'
  //   : privateAssistant
  //   ? 'Private'
  //   : unlistedAssistant
  //   ? 'Unlisted'
  //   : null

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
      : navigate(`/${bot?.name}`, {
          state: {
            preview: false,
            distName: bot?.name,
            displayName: bot?.display_name,
          },
        })
    e.stopPropagation()
  }

  const queryClient = useQueryClient()

  const status = useQuery({
    queryKey: ['deploy', bot?.deployment?.id],
    queryFn: () => getDeploy(bot?.deployment?.id!),
    refetchOnMount: false,
    enabled:
      bot?.deployment?.id !== undefined &&
      type !== 'public' &&
      bot?.deployment?.state !== 'UP',
    onSuccess(data) {
      data?.state === 'UP' && queryClient.invalidateQueries('privateDists')
      if (data?.state !== 'UP' && data?.state !== null && data?.error == null) {
        setTimeout(() => {
          queryClient.invalidateQueries('deploy', data?.id)
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
                  Use
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
                Edit
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
