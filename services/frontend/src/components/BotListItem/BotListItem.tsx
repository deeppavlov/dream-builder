import { FC, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/icons/dp.svg'
import { ReactComponent as Clone } from '../../assets/icons/clone.svg'
import { ReactComponent as PreviewIcon } from '@assets/icons/eye.svg'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'
import { useAuth } from '../../Context/AuthProvider'
import { Kebab } from '../../ui/Kebab/Kebab'
import Button from '../../ui/Button/Button'
import { ReactComponent as Edit } from '../../assets/icons/edit_pencil.svg'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { dateToUTC } from '../../utils/dateToUTC'
import { timeToUTC } from '../../utils/timeToUTC'
import s from './BotListItem.module.scss'

interface BotListItemProps {
  type: BotAvailabilityType
  bot: BotInfoInterface
  disabled?: boolean
}

export const BotListItem: FC<BotListItemProps> = ({ type, bot, disabled }) => {
  const navigate = useNavigate()
  const tooltipId = useId()
  const dateCreated = dateToUTC(new Date(bot?.date_created))
  const time = timeToUTC(new Date(bot?.date_created))

  const handleBotListItemClick = () => {
    trigger(BASE_SP_EVENT, {
      children: (
        <BotInfoSidePanel key={bot?.name} bot={bot} disabled={disabled} />
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

  const handlEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    navigate(`/${bot?.name}`, {
      state: {
        preview: false,
        distName: bot?.name,
        displayName: bot?.display_name,
      },
    })
  }

  return (
    <tr className={s.tr} onClick={handleBotListItemClick}>
      <td className={s.td}>
        <div className={s.name}>
          <p className={s.botName}>{bot?.display_name || '------'}</p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.author}>
          <Logo />
          <p>{bot?.author}</p>
        </div>
      </td>
      <td className={s.td}>
        <div
          className={s.description}
          data-tooltip-id={'botTableDesc' + tooltipId}>
          {bot?.description}
          <BaseToolTip
            id={'botTableDesc' + tooltipId}
            content={bot?.description}
            place='bottom'
            theme='description'
          />
        </div>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{dateCreated || '------'}</p>
          <p className={s.time}>{time || '------'}</p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <Button
            theme='primary'
            small
            withIcon
            props={{
              onClick: type === 'public' ? handleCloneClick : handlEditClick,
            }}>
            {type === 'public' ? <Clone /> : <Edit />}
          </Button>

          {type === 'your' ? (
            <>
              <Kebab tooltipId={'ctxMenu' + tooltipId} theme='card' />
              <BotCardToolTip
                tooltipId={'ctxMenu' + tooltipId}
                bot={bot}
                type={type}
              />
            </>
          ) : (
            <Button
              theme='secondary'
              small
              withIcon
              props={{ onClick: handlePreviewClick }}>
              <PreviewIcon />
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}
