import { FC, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/icons/dp.svg'
import { ReactComponent as Clone } from '../../assets/icons/clone.svg'
import { ReactComponent as PreviewIcon } from '@assets/icons/eye.svg'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'
import { useAuth } from '../../context/AuthProvider'
import { Kebab } from '../../ui/Kebab/Kebab'
import Button from '../../ui/Button/Button'
import { ReactComponent as Edit } from '../../assets/icons/edit_pencil.svg'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { dateToUTC } from '../../utils/dateToUTC'
import { timeToUTC } from '../../utils/timeToUTC'
import s from './BotListItem.module.scss'

interface BotListItemProps {
  disabledMsg?: string
  type: BotAvailabilityType
  bot: BotInfoInterface
}

export const BotListItem: FC<BotListItemProps> = ({
  disabledMsg,
  type,
  bot,
}) => {
  const auth = useAuth()
  const navigate = useNavigate()
  const tooltipId = useId()
  const dateCreated = dateToUTC(new Date(bot?.date_created))
  const time = timeToUTC(new Date(bot?.date_created))
  const signInMessage = !auth?.user
    ? 'You must be signed in to clone the bot'
    : undefined

  const handleBotListItemClick = () => {
    trigger(BASE_SP_EVENT, {
      children: (
        <BotInfoSidePanel key={bot?.name} bot={bot} disabledMsg={disabledMsg} />
      ),
    })
  }

  const handleCloneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    trigger('AssistantModal', { action: 'clone', bot: bot })
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
          data-tooltip-id={'botTableDesc' + bot.name}>
          {bot?.description}
          <BaseToolTip
            id={'botTableDesc' + bot.name}
            content={bot?.description}
            place='top'
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
          <div data-tip data-tooltip-id={'botClone' + bot?.name}>
            <Button
              theme='primary'
              small
              withIcon
              props={{
                disabled: disabledMsg !== undefined,
                onClick: type === 'public' ? handleCloneClick : handlEditClick,
              }}>
              {type === 'public' ? <Clone /> : <Edit />}
            </Button>
          </div>

          {type === 'your' ? (
            <>
              <Kebab tooltipId={tooltipId} theme='card' />
              <BotCardToolTip tooltipId={tooltipId} bot={bot} type={type} />
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
      {disabledMsg && (
        <BaseToolTip
          id={'botClone' + bot?.name}
          content={disabledMsg}
          place='bottom'
          theme='small'
        />
      )}
    </tr>
  )
}
