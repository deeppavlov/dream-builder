import { KebabButton } from '../../ui/KebabButton/KebabButton'
import Calendar from '../../assets/icons/calendar.svg'
import IMG from '../../assets/icons/pavlovInCard.svg'
import s from './BotCard.module.scss'
import Button from '../../ui/Button/Button'
import ReactTooltip from 'react-tooltip'
import { useAuth } from '../../services/AuthProvider'
import { useState } from 'react'
import BotInfoSidePanel from '../BotInfoSidePanel/BotInfoSidePanel'

export const BotCard = ({
  botName,
  companyName,
  date,
  version,
  ram,
  gpu,
  space,
  type,
  disabledMsg,
}: any) => {
  const auth = useAuth()
  const [isOpenProperties, setIsOpenProperties] = useState(false)

  return (
    <>
      <div className={s.card}>
        <div className={s.header}>
          <h6>{botName ? botName : 'Name of The Bot'} </h6>
        </div>
        <div className={s.body}>
          <div className={s.top}>
            <div className={s.name}>
              <img src={IMG} />
              <h6>{companyName ? companyName : 'Name of The Company'}</h6>
            </div>
            <div className={s.info}>
              <p>
                Our fouray into building consumer friendly virtual assistants.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <div className={s.date}>
                <img className={s.icon} src={Calendar} />
                <p style={{ fontSize: '14px' }}>{date ? date : '27.10.2022'}</p>
              </div>
              <div className={s.version}>
                <p style={{ fontSize: '12px' }}>
                  {version ? version : 'v.0.01'}
                </p>
              </div>
            </div>
          </div>
          <span className={s.separator} />
          <div className={s.middle}>
            <ul className={s.params}>
              <li>
                <p className={s.params_item}>RAM</p>
                <p className={s.params_item__units}>0.0 GB</p>
              </li>
              <li>
                <p className={s.params_item}>GPU</p>
                <p className={s.params_item__units}>0.0 GB</p>
              </li>
              <li>
                <p className={s.params_item}>Disk Space</p>
                <p className={s.params_item__units}>0.0 GB</p>
              </li>
            </ul>
          </div>
          <div className={s.bottom}>
            <div className={s.btns_area}>
              <div
                data-tip
                data-for='bot-clone-interact'
                style={{ width: '100%' }}>
                <Button
                  theme='primary'
                  small
                  long
                  props={{ disabled: auth?.user === null }}>
                  Clone
                </Button>
              </div>
              <div
                className={s.kebab}
                onClick={() => setIsOpenProperties(true)}>
                <KebabButton />
              </div>
            </div>
          </div>
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
      <BotInfoSidePanel
        isOpen={isOpenProperties}
        setIsOpen={setIsOpenProperties}
        position={{ top: 64 }}
      />
    </>
  )
}
