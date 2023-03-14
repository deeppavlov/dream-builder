import { useId } from 'react'
import classNames from 'classnames/bind'
import { useNavigate } from 'react-router-dom'
import { trigger } from '../../utils/events'
import {
  BotAvailabilityType,
  BotCardSize,
  BotInfoInterface,
} from '../../types/types'
import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import { ReactComponent as PreviewIcon } from '@assets/icons/eye.svg'
import Button from '../../ui/Button/Button'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import ResourcesTable from '../ResourcesTable/ResourcesTable'
import { Kebab } from '../../ui/Kebab/Kebab'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { useAuth } from '../../context/AuthProvider'
import { dateToUTC } from '../../utils/dateToUTC'
import s from './BotCard.module.scss'

interface BotCardProps {
  type: BotAvailabilityType
  bot: BotInfoInterface
  size?: BotCardSize
  // disabledMsg?: string
  disabled: boolean
}

export const BotCard = ({ type, bot, size, disabled }: BotCardProps) => {
  const auth = useAuth()
  const navigate = useNavigate()
  const tooltipId = useId()
  let cx = classNames.bind(s)
  const dateCreated = dateToUTC(new Date(bot?.date_created))

  const handleBotCardClick = () => {
    trigger(BASE_SP_EVENT, {
      children: (
        <BotInfoSidePanel key={bot?.name} bot={bot} disabled={disabled} />
      ),
    })
  }

  const handlePreviewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    navigate(`/${bot?.name}`, {
      state: {
        preview: true,
        distName: bot?.name,
        displayName: bot?.display_name,
      },
    })
  }

  const handleCloneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (!disabled) {
      trigger('AssistantModal', { action: 'clone', bot: bot })
      return
    }

    trigger('SignInModal', {})
    e.stopPropagation()
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
      onClick={handleBotCardClick}>
      <div className={s.header}>{bot?.display_name}</div>
      <div className={s.body}>
        <div className={s.block}>
          {type === 'public' && (
            <div className={s.author}>
              <img referrerPolicy='no-referrer' src={DeepPavlovLogo} />
              <span>{bot?.author}</span>
            </div>
          )}
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
                className={s.container}>
                <Button
                  theme='primary'
                  small
                  long
                  props={{ onClick: handleCloneClick }}>
                  Clone
                </Button>
              </div>
              <Button
                theme='secondary'
                small
                withIcon
                props={{ onClick: handlePreviewClick }}>
                <PreviewIcon />
              </Button>
            </>
          ) : (
            <>
              <Button
                theme='primary'
                small
                long
                props={{ onClick: handlEditClick }}>
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
