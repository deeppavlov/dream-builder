import { Link } from 'react-router-dom'
import Calendar from '../../assets/icons/calendar.svg'
import IMG from '../../assets/icons/skillIcon.svg'
import s from './SkillCard.module.scss'

export const SkillCard = ({
  skillName,
  companyName,
  date,
  version,
  ram,
  gpu,
  space,
}: any) => {
  return (
    <div className={s.skill}>
      <div className={s.header}>
        <h6>{skillName ? skillName : 'Name of The Skill'} </h6>
        <input type='checkbox' />
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.name}>
            <img src={IMG} />
            <h6>{companyName ? companyName : 'Retrieval Skill'}</h6>
          </div>
          <div className={s.twoLines}>
            <p>
              Helps users locate the nearest store. And we can write 2 lines
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
        <hr />
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
            <Link to='/editor'>
              <button className={s.clone_btn}>Add</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
