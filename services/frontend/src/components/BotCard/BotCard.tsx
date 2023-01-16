import ReactTooltip from 'react-tooltip'
import Calendar from '@assets/icons/calendar.svg'
import CompanyLogo from '@assets/icons/pavlovInCard.svg'
import { BotInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import Button from '../../ui/Button/Button'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './BotCard.module.scss'

interface BotCardProps extends BotInfoInterface {
  disabledMsg?: string
  routingName: string
}

export const BotCard = ({
  name,
  routingName,
  author,
  desc,
  dateCreated,
  version,
  ram,
  gpu,
  space,
  disabledMsg,
}: BotCardProps) => {
  const handleBotCardClick = () => {
    trigger('BotInfoSidePanel', {
      name,
      author,
      desc,
      dateCreated,
      version,
      ram,
      gpu,
      space,
    })
  }

  const handleCloneBtnClick = (e: any) => {
    e.stopPropagation()
    trigger('CreateAssistantModal', {
      name,
      routingName,
      author,
      desc,
      dateCreated,
      version,
      ram,
      gpu,
      space,
    })
  }

  return (
    <div className={s.card} onClick={handleBotCardClick}>
      <div className={s.header}>
        <p className={s.botName}>{name || 'Name of The Bot'} </p>
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.name}>
            <img className={s.companyLogo} src={CompanyLogo} />
            <p className={s.companyName}>{author || 'Name of The Company'}</p>
          </div>
          <div
            className={s.description}
            data-for='descriptionTooltip'
            data-tip={desc}>
            <ReactTooltip
              id='descriptionTooltip'
              effect='solid'
              className={s.tooltips}
              delayShow={500}
            />
            <div className={s.descriptionText}>
              {desc + '...' || 'Lorem ipsum dolores est'}
            </div>
          </div>
          <div className={s.info}>
            <div className={s.date}>
              <img className={s.icon} src={Calendar} />
              <p className={s.dateText}>{dateCreated || '27.10.2022'}</p>
            </div>
            <SmallTag theme='version'>v{version || '0.0.0'}</SmallTag>
          </div>
        </div>
        <span className={s.separator} />
        <div className={s.middle}>
          <ul className={s.params}>
            <li>
              <p className={s.item}>RAM</p>
              <p className={s.units}>{ram || '0.0GB'}</p>
            </li>
            <li>
              <p className={s.item}>GPU</p>
              <p className={s.units}>{gpu || '0.0GB'}</p>
            </li>
            <li>
              <p className={s.item}>Disk Space</p>
              <p className={s.units}>{space || '0.0GB'}</p>
            </li>
          </ul>
        </div>
        <div className={s.bottom}>
          <div data-tip data-for='bot-clone-interact' style={{ width: '100%' }}>
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
          </div>
        </div>
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
