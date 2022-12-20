import ReactTooltip from 'react-tooltip'
import Calendar from '@assets/icons/calendar.svg'
import CompanyLogo from '@assets/icons/pavlovInCard.svg'
import { SmallTag } from '../SmallTag/SmallTag'
import { CreateAssistantModal } from '../ModalWindows/CreateAssistantModal'
import s from './BotCard.module.scss'
import Button from '../../ui/Button/Button'
import { useState } from 'react'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'

export interface BotCardProps {
  botName: string
  companyName: string
  description: string
  date: string
  version: string
  ram: string
  gpu: string
  space?: string
  disabledMsg?: string
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
  disabledMsg,
}: BotCardProps) => {
  const [botPropertiesIsOpen, setBotPropertiesIsOpen] = useState(false)

  const handleBotCardClick = () => {
    if (!botPropertiesIsOpen) setBotPropertiesIsOpen(true)
  }

  return (
    <div className={s.card} onClick={handleBotCardClick}>
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
          <div className={s.description}>
            <p className={s.descriptionText}>
              {description || 'Lorem ipsum dolores est'}
            </p>
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
          {/* <CreateAssistantModal>
            Clone
          </CreateAssistantModal> */}
          <div data-tip data-for='bot-clone-interact' style={{ width: '100%' }}>
            <Button
              theme='primary'
              small
              long
              props={{ disabled: disabledMsg !== undefined }}>
              Clone
            </Button>
          </div>
        </div>
      </div>
      <BotInfoSidePanel
        isOpen={botPropertiesIsOpen}
        setIsOpen={setBotPropertiesIsOpen}
        position={{ top: 64 }}
      />
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
