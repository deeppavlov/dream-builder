import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import classNames from 'classnames/bind'
import { FC, useId, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplay } from '../../context/DisplayContext'
import { BotCardProps } from '../../types/types'
import Button from '../../ui/Button/Button'
import { Kebab } from '../../ui/Kebab/Kebab'
import { consts } from '../../utils/consts'
import { dateToUTC } from '../../utils/dateToUTC'
import { trigger } from '../../utils/events'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
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
  const panelIsOpen = options.get(consts.RIGHT_SP_IS_ACTIVE)

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
    navigate(`/${bot?.name}`, {
      state: {
        preview: false,
        distName: bot?.name,
        displayName: bot?.display_name,
      },
    })
    e.stopPropagation()
  }

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
                  ? 'On moderation'
                  : bot?.visibility === 'public_template'
                  ? 'Public'
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
                props={{ onClick: handlEditClick }}
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
