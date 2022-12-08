import { Link } from 'react-router-dom'
import { Kebab } from '../../ui/Kebab/Kebab'
import Calendar from '../../assets/icons/calendar.svg'
import s from './YourBotCard.module.scss'
import { KebabButton } from '../../ui/KebabButton/KebabButton'

export const YourBotCard = ({
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
          <div className={s.info}>
            <p>
              Small description about the project maximum 4 lines. Small
              description about the project maximum{' '}
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
            <Link to='editor'>
            <button className={s.clone_btn}>Clone</button>
            </Link>
            <div className={s.kebab}>
              <KebabButton dataFor='your_bot' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
