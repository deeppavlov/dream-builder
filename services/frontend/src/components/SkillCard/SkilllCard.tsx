import { Link } from 'react-router-dom'
import Calendar from '../../assets/icons/calendar.svg'
import SkillTypeLogo from '../../assets/icons/skillIcon.svg'
import CompanyLogo from '../../assets/icons/pavlovInCard.svg'
import { CheckBox } from '../../ui/Checkbox/Checkbox'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import s from './SkillCard.module.scss'

export const SkillCard = ({
  skillName,
  companyName,
  date,
  version,
  ram,
  gpu,
  space,
  skillType,
}: any) => {
  return (
    <div className={s.skill}>
      <div className={s.header}>
        <h6>{skillName ? skillName : 'Name of The Skill'} </h6>
        {/* <CheckBox /> */}
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.name}>
            <div className={s.type}>
              <img src={SkillTypeLogo} />
              <h6>{skillType ? skillType : 'Retrieval Skill'}</h6>
            </div>
            <div className={s.company}>
              <img src={CompanyLogo} />
              <h6>{companyName ? companyName : 'Name of The Company'}</h6>
            </div>
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
            <button className={s.clone_btn}>Add</button>
            <KebabButton dataFor='skills' />
          </div>
        </div>
      </div>
    </div>
  )
}
