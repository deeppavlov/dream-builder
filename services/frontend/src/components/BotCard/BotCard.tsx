import ReactTooltip from 'react-tooltip'
import Calendar from '../../assets/icons/calendar.svg'
import CompanyLogo from '../../assets/icons/pavlovInCard.svg'
import { useAuth } from '../../services/AuthProvider'
import { SmallTag } from '../SmallTag/SmallTag'
import { CreateAssistantModal } from '../ModalWindows/CreateAssistantModal'
import s from './BotCard.module.scss'

export interface BotCardProps {
  botName: string
  companyName: string
  description: string
  date: string
  version: string
  ram: string
  gpu: string
  space?: string
}

export const BotCard = ({
  botName,
  companyName,
  description,
  date,
  version,
  ram,
  gpu,
  space,
}: BotCardProps) => {
  const auth = useAuth()

  return (
    <div className={s.card}>
      <div className={s.header}>
        <p className={s.botName}>{botName || 'Name of The Bot'} </p>
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.name}>
            <img className={s.companyLogo} src={CompanyLogo} />
            <p className={s.companyName}>
              {companyName || 'Name of The Company'}
            </p>
          </div>
          <div
            className={s.description}
            data-for='descriptionTooltip'
            data-tip={description}>
            <ReactTooltip
              id='descriptionTooltip'
              effect='solid'
              className={s.tooltips}
              delayShow={500}
            />
            <div className={s.descriptionText}>
              {description + '...' || 'Lorem ipsum dolores est'}
            </div>
          </div>
          <div className={s.info}>
            <div className={s.date}>
              <img className={s.icon} src={Calendar} />
              <p className={s.dateText}>{date || '27.10.2022'}</p>
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
          <CreateAssistantModal data-tip data-for='bot-clone-interact'>Clone</CreateAssistantModal>
        </div>
      </div>
      {auth?.user === null && (
        <ReactTooltip
          place='bottom'
          effect='solid'
          className='tooltips'
          arrowColor='#8d96b5'
          delayShow={1000}
          id='bot-clone-interact'>
          You must be signed in to clone the bot
        </ReactTooltip>
      )}
    </div>
  )
}
