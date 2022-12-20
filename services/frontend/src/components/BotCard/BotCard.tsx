import Calendar from '../../assets/icons/calendar.svg'
import IMG from '../../assets/icons/pavlovInCard.svg'
import { CreateAssistantModal } from '../ModalWindows/CreateAssistantModal'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import s from './BotCard.module.scss'

export const BotCard = ({
  botName,
  companyName,
  date,
  version,
  ram,
  gpu,
  space,
  type,
}: any) => {
  return (
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
              <p style={{ fontSize: '12px' }}>{version ? version : 'v.0.01'}</p>
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
            <CreateAssistantModal>Clone</CreateAssistantModal>
            <KebabButton dataFor='bot_public' />
          </div>
        </div>
      </div>
    </div>
  )
}
