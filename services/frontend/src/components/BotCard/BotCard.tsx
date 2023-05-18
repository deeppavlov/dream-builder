import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import classNames from 'classnames/bind'
import { FC, useId } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useDisplay } from '../../context/DisplayContext'
import { getDeploy } from '../../services/getDeploy'
import { BotCardProps } from '../../types/types'
import Button from '../../ui/Button/Button'
import { Kebab } from '../../ui/Kebab/Kebab'
import { consts } from '../../utils/consts'
import { dateToUTC } from '../../utils/dateToUTC'
import { trigger } from '../../utils/events'
import AssistantSidePanel from '../AssistantSidePanel/AssistantSidePanel'
import { Badge } from '../Badge/Badge'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './BotCard.module.scss'

export const BotCard: FC<BotCardProps> = ({ type, bot, size, disabled }) => {
  const navigate = useNavigate()
  const tooltipId = useId()
  const { options } = useDisplay()

  let cx = classNames.bind(s)

  const dateCreated = dateToUTC(new Date(bot?.date_created))

  const infoSPId = `info_${bot.id}`
  const activeAssistantId = options.get(consts.ACTIVE_ASSISTANT_SP_ID)
  const isActive =
    infoSPId === activeAssistantId || bot.id === activeAssistantId

  const onModeration = bot?.publish_state === 'in_progress'
  const published = bot?.visibility === 'public_template'
  const deployed = bot?.deployment?.state === 'UP'
  const deploying =
    !deployed && bot?.deployment?.state !== null && bot?.deployment !== null

  const publishState = !bot?.publish_state
    ? type === 'your' && bot?.visibility
    : onModeration
    ? 'On Moderation'
    : published
    ? 'Public Template'
    : bot?.visibility

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
    published
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
      data?.state === 'UP' &&
        queryClient.invalidateQueries('dist', data?.virtual_assistant?.name)

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
      className={cx('botCard', `${type}`, size)}
      onClick={handleBotCardClick}
      data-active={isActive}
    >
      {type === 'your' && deployed && <Badge />}
      <div className={cx('header', deploying && 'deploying')}>
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
              <BotCardToolTip tooltipId={tooltipId} bot={bot} type={type} />
            </>
          ) : (
            <>
              <Button
                theme='primary'
                small
                long
                props={{
                  onClick: handlEditClick,
                  disabled: onModeration || deploying,
                }}
              >
                Edit
              </Button>
              <Kebab tooltipId={tooltipId} theme='card' />
              <BotCardToolTip tooltipId={tooltipId} bot={bot} type={type} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
