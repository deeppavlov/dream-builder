import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import { ReactComponent as Calendar } from '../../assets/icons/calendar.svg'
import { ReactComponent as SkillTypeLogo } from '../../assets/icons/fallbacks.svg'
import CompanyLogo from '../../assets/icons/pavlovInCard.svg'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import s from './SkillInBotCard.module.scss'

export const SkillInBotCard = ({
  botName,
  companyName,
  date,
  version,
  ram,
  gpu,
  space,
  type,
  skillType,
  ...props
}: any) => {
  const [disabled, setDisabled] = useState(true)

  const sliderHandler = () => {
    setDisabled(!disabled)
    console.log('skill state was changed')
    console.log(disabled)
  }
  return (
    <div style={{ ...props, opacity: !disabled && '0.3' }} className={s.card}>
      <div className={s.header}>
        <h6>{botName ? botName : 'Name of The Skill'} </h6>
        <ToggleButton sliderHandler={sliderHandler} />
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.name}>
            <div className={s.type}>
              <SkillTypeLogo />
              <h6>{skillType ? skillType : 'Retrieval Skill'}</h6>
            </div>
            <div className={s.company}>
              <img src={CompanyLogo} />
              <h6>{companyName ? companyName : 'Name of The Company'}</h6>
            </div>
          </div>
          <div className={s.info}>
            <p>
              Helps users locate the nearest store. And we can write 3 lines
              here and this is maximum about
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
              <Calendar />
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
              <p className={s.params_item}>Execution Time</p>
              <p className={s.params_item__units}>0.0 ms</p>
            </li>
          </ul>
        </div>
        <div className={s.bottom}>
          <div className={s.btns_area}>
            <button className={s.clone_btn}>Edit Skill</button>
            <div className={s.kebab}>
              <KebabButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
