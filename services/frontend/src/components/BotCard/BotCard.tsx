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
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'
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
          {/* {type === 'public' && (
            <div className={s.author}>
              <img referrerPolicy='no-referrer' src={Woman} />
              <span>
                {bot?.author?.fullname! == 'Deepy Pavlova'
                  ? 'Dr. Xandra Smith'
                  : bot?.author?.fullname!}
              </span>
            </div>
          )} */}
          <div className={s.desc} data-tooltip-id={'botCardDesc' + bot?.name}>
            {bot?.description}
            <BaseToolTip
              id={'botCardDesc' + bot?.name}
              content={bot?.description}
              place='top'
              theme='description'
            />
          </div>
          <span className={s.separator} />
          <div className={s.dateAndVersion}>
            <div className={s.date}>
              <CalendarIcon />
              {dateCreated}
            </div>
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
