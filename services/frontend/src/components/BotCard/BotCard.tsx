import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import classNames from 'classnames/bind'
import { FC, useId, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TOOLTIP_DELAY } from '../../constants/constants'
import { useDisplay } from '../../context/DisplayContext'
import { BotCardProps } from '../../types/types'
import Button from '../../ui/Button/Button'
import { Kebab } from '../../ui/Kebab/Kebab'
import { consts } from '../../utils/consts'
import { dateToUTC } from '../../utils/dateToUTC'
import { trigger } from '../../utils/events'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './BotCard.module.scss'

export const BotCard: FC<BotCardProps> = ({ type, bot, size, disabled }) => {
  const navigate = useNavigate()
  const tooltipId = useId()
  let cx = classNames.bind(s)
  const dateCreated = dateToUTC(new Date(bot?.date_created))
  const botCardRef = useRef(null)
  const { options } = useDisplay()
  const activeAssistantId = options.get(consts.ACTIVE_ASSISTANT_SP_ID)

  const handleBotCardClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      parent: botCardRef,
      children: (
        <BotInfoSidePanel
          type={type}
          key={bot?.name}
          bot={bot}
          disabled={disabled}
        />
      ),
    })
  }

  const handleCloneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!disabled) {
      trigger('AssistantModal', { action: 'clone', bot: bot })
      return
    }

    trigger('SignInModal', {})
  }

  const handlEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    bot?.visibility === 'public_template'
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
  const onModeration = bot?.publish_state === 'in_progress'

  return (
    <div
      className={cx('botCard', `${type}`, size)}
      onClick={handleBotCardClick}
      ref={botCardRef}
      data-active={bot.name === activeAssistantId}
    >
      <div className={s.header}>{bot?.display_name}</div>
      <div className={s.body}>
        <div className={s.block}>
          <div className={s.desc} data-tooltip-id={'botCardDesc' + bot?.name}>
            {bot?.description}
          </div>
          <span className={s.separator} />
          <div className={s.dateAndVersion}>
            <div className={s.date}>
              <CalendarIcon />
              {dateCreated}
            </div>

            {type == 'your' && (
              <SmallTag
                theme={
                  bot?.publish_state === 'in_progress'
                    ? 'validating'
                    : bot?.visibility
                }
              >
                {!bot?.publish_state
                  ? type === 'your' && bot?.visibility
                  : bot?.publish_state == 'in_progress'
                  ? 'On Moderation'
                  : bot?.visibility === 'public_template'
                  ? 'Public Template'
                  : bot?.visibility}
              </SmallTag>
            )}
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
                  'data-tooltip-id': 'youcant' + tooltipId,
                  onClick: handlEditClick,
                  disabled: onModeration,
                }}
              >
                Edit
              </Button>
              {onModeration && (
                <BaseToolTip
                  id={'youcant' + tooltipId}
                  content={
                    'You cannot edit the ASSISTANT while its under moderation.'
                  }
                  place='bottom'
                  theme='description'
                  delayShow={TOOLTIP_DELAY}
                />
              )}
              <Kebab tooltipId={tooltipId} theme='card' />
              <BotCardToolTip tooltipId={tooltipId} bot={bot} type={type} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
