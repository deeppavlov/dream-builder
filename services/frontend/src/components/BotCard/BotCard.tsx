import { useId } from 'react'
import classNames from 'classnames/bind'
import { trigger } from '../../utils/events'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import { ReactComponent as CalendarIcon } from '@assets/icons/calendar.svg'
import { ReactComponent as PreviewIcon } from '@assets/icons/eye.svg'
import Button from '../../ui/Button/Button'
import ResourcesTable from '../ResourcesTable/ResourcesTable'
import { Kebab } from '../../ui/Kebab/Kebab'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'
import { useNavigate } from 'react-router-dom'
import BotCardToolTip from '../BotCardToolTip/BotCardToolTip'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import s from './BotCard.module.scss'

interface BotCardProps extends BotInfoInterface {
  type: BotAvailabilityType
  disabled: boolean
  size?: 'small' | 'big'
}

export const BotCard = ({
  type,
  name,
  routingName,
  author,
  authorImg,
  desc,
  dateCreated,
  version,
  ram,
  gpu,
  space,
  size,
  disabled,
}: BotCardProps) => {
  const bot = {
    routingName,
    name,
    author,
    authorImg,
    desc,
    dateCreated,
    version,
    ram,
    gpu,
    space,
  }
  const navigate = useNavigate()
  const tooltipId = useId()
  let cx = classNames.bind(s)

  const handleBotCardClick = () => {
    trigger(BASE_SP_EVENT, {
      children: (
        <BotInfoSidePanel key={bot.name} bot={bot} disabled={disabled} />
      ),
    })
  }

  const handlePreviewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    navigate(`/${routingName}`, {
      state: { preview: true, distName: routingName, displayName: name },
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
    if (!disabled) {
      navigate(`/${routingName}`, {
        state: { preview: false, distName: routingName, displayName: name },
      })
      return
    }

    trigger('SignInModal', {})
    e.stopPropagation()
  }

  return (
    <div
      className={cx('botCard', `${type}`, size)}
      onClick={handleBotCardClick}>
      <div className={s.name}>{name}</div>
      <div className={s.block}>
        {type === 'public' && (
          <div className={s.author}>
            <img referrerPolicy='no-referrer' src={authorImg} />
            <span>{author}</span>
          </div>
        )}
        <div className={s.desc} data-tooltip-id={'botCardDesc' + tooltipId}>
          {desc}
          <BaseToolTip
            id={'botCardDesc' + tooltipId}
            content={desc}
            place='bottom'
            theme='description'
          />
        </div>
        <div className={s.dateAndVersion}>
          <div className={s.date}>
            <CalendarIcon />
            {dateCreated}
          </div>
        </div>
        <span className={s.separator} />
      </div>
      <div className={s.resources}>
        <ResourcesTable
          values={[
            {
              name: 'RAM',
              value: ram || '0.0GB',
            },
            {
              name: 'GPU',
              value: gpu || '0.0GB',
            },
            {
              name: 'Disk Space',
              value: space || '0.0GB',
            },
          ]}
        />
      </div>
      <div className={s.btns}>
        {type === 'public' ? (
          <>
            <Button
              theme='primary'
              small
              long
              props={{
                onClick: handleCloneClick,
              }}>
              Clone
            </Button>
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

            <Kebab tooltipId={'ctxMenu' + tooltipId} theme='card' />
            <BotCardToolTip
              tooltipId={'ctxMenu' + tooltipId}
              bot={bot}
              type={type}
            />
          </>
        )}
      </div>
    </div>
  )
}
