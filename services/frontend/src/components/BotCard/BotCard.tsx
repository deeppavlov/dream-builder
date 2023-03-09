import { useId } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
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
import s from './BotCard.module.scss'

interface BotCardProps extends BotInfoInterface {
  type: BotAvailabilityType
  size?: 'small' | 'big'
  disabledMsg?: string
  routingName: string
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
  disabledMsg,
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

  const handleBotCardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trigger(BASE_SP_EVENT, {
      children: <BotInfoSidePanel key={bot.name} bot={bot} />,
    })
    e.stopPropagation()
  }

  const handlePreviewBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/${routingName}`, {
      state: { preview: true, distName: routingName, displayName: name },
    })
    e.stopPropagation()
  }

  const handleCloneBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trigger('AssistantModal', { action: 'clone', bot: bot })
    e.stopPropagation()
  }

  const handlEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/${routingName}`, {
      state: { preview: false, distName: routingName, displayName: name },
    })
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
        <div className={s.desc} data-for='descriptionTooltip' data-tip={desc}>
          {desc}
          <ReactTooltip
            id='descriptionTooltip'
            effect='solid'
            className={s.tooltips}
            delayShow={500}
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
          <div data-tip data-for='bot-clone-interact' className={s.container}>
            <Button
              theme='primary'
              small
              long
              props={{
                disabled: disabledMsg !== undefined,
                onClick: handleCloneBtnClick,
              }}>
              Clone
            </Button>
            <Button
              theme='secondary'
              small
              withIcon
              props={{ onClick: handlePreviewBtnClick }}>
              <PreviewIcon />
            </Button>
          </div>
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
            <BotCardToolTip tooltipId={tooltipId} bot={bot} />
          </>
        )}
      </div>

      {disabledMsg && (
        <ReactTooltip
          place='bottom'
          effect='solid'
          className='tooltips'
          arrowColor='#8d96b5'
          delayShow={1000}
          id='bot-clone-interact'>
          {disabledMsg}
        </ReactTooltip>
      )}
    </div>
  )
}
