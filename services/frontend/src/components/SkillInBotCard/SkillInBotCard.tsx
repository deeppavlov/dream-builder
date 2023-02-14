import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import { ReactComponent as Calendar } from '../../assets/icons/calendar.svg'
import { ReactComponent as SkillFallbackIcon } from '../../assets/icons/fallbacks.svg'
import CompanyLogo from '../../assets/icons/pavlovInCard.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import s from './SkillInBotCard.module.scss'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { SkillInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import Button from '../../ui/Button/Button'
import { useAuth } from '../../Router/AuthProvider'

interface SkillInBotCardProps extends SkillInfoInterface {
  checkbox?: boolean
  disabledMsg?: string
}

export const SkillInBotCard = ({
  name,
  author,
  desc,
  dateCreated,
  version,
  ram,
  gpu,
  space,
  executionTime,
  skillType,
  checkbox,
  disabledMsg,
}: SkillInBotCardProps) => {
  const auth = useAuth()
  const [disabled, setDisabled] = useState(true)

  const sliderHandler = () => {
    setDisabled(disabled => !disabled)
  }

  const handleSkillCardClick = () => {
    trigger('SkillSidePanel', {
      name,
      author,
      desc,
      dateCreated,
      version,
      ram,
      gpu,
      space,
      executionTime,
      skillType,
    })
  }

  const handleEditSkillBtnClick = (e: any) => {
    e.stopPropagation()
    trigger('CreateSkillModal', {
      name,
      author,
      desc,
      dateCreated,
      version,
      ram,
      gpu,
      space,
      executionTime,
      skillType,
    })
  }

  return (
    <div
      className={s.card}
      style={{ maxWidth: '330px' }}
      onClick={handleSkillCardClick}>
      <div className={s.header}>
        <h6>{name} </h6>
        <ToggleButton sliderHandler={sliderHandler} />
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.name}>
            <div className={s.type}>
              <SkillFallbackIcon />
              <h6>{skillType}</h6>
            </div>
            <div className={s.company}>
              <img src={auth?.user?.picture} />
              <h6>{author}</h6>
            </div>
          </div>
          <div className={s.info}>
            <p>{desc}</p>
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
              <p style={{ fontSize: '14px' }}>{dateCreated ?? '27.10.2022'}</p>
            </div>
            <div className={s.version}>
              <p style={{ fontSize: '12px' }}>v{version ?? '0.01'}</p>
            </div>
          </div>
        </div>
        <span className={s.separator} />
        <div className={s.middle}>
          <ul className={s.params}>
            <li>
              <p className={s.params_item}>RAM</p>
              <p className={s.params_item__units}>{ram ?? '0.0 GB'}</p>
            </li>
            <li>
              <p className={s.params_item}>Execution Time</p>
              <p className={s.params_item__units}>
                {executionTime ?? '0.0 ms'}
              </p>
            </li>
          </ul>
        </div>
        <div className={s.bottom}>
          <div className={s.btns_area}>
            <Button
              theme='secondary'
              small
              long
              props={{ onClick: handleEditSkillBtnClick }}>
              Edit Skill
            </Button>
            <KebabButton dataFor='customizable_skill' />
          </div>
        </div>
      </div>
    </div>
  )
}
