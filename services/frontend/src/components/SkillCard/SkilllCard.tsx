import ReactTooltip from 'react-tooltip'
import classNames from 'classnames/bind'
import Calendar from '../../assets/icons/calendar.svg'
import CompanyLogo from '../../assets/icons/pavlovInCard.svg'
import { BotCardProps } from '../BotCard/BotCard'
import { SmallTag } from '../SmallTag/SmallTag'
import { CreateAssistantModal } from '../ModalWindows/CreateAssistantModal'
import { useAuth } from '../../services/AuthProvider'
import s from './SkillCard.module.scss'

export interface SkillCardProps extends BotCardProps {
  skillName: string
  skillType:
    | 'fallbacks'
    | 'retrieval'
    | 'generative'
    | 'q_a'
    | 'script'
    | 'script_with_nns'
  time: string
  checkbox?: boolean
  executionTime: string
}

export const SkillCard = ({
  skillName,
  companyName,
  description,
  date,
  version,
  ram,
  gpu,
  executionTime,
  skillType,
  checkbox,
}: SkillCardProps) => {
  let cx = classNames.bind(s)
  const auth = useAuth()

  return (
    <div className={s.card}>
      <div className={s.header}>
        <p className={s.botName}>{skillName || 'Name of The Skill'} </p>

      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.type}>
            <img
              className={s.typeLogo}
              src={`./src/assets/icons/${skillType}.svg`}
            />
            <p className={cx('typeText', skillType)}>
              {skillType || 'Type of Skill'}
            </p>
          </div>
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
              {description || 'Lorem ipsum dolores est'}
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
              <p className={s.item}>Execution Time</p>
              <p className={s.units}>{executionTime + 's' || '0.0s'}</p>
            </li>
          </ul>
        </div>
        <div className={s.bottom}>
          <CreateAssistantModal data-tip data-for='skill-add-interact'>
            Add Skill
          </CreateAssistantModal>
        </div>
      </div>
      {auth?.user === null && (
        <ReactTooltip
          place='bottom'
          effect='solid'
          className='tooltips'
          arrowColor='#8d96b5'
          delayShow={1000}
          id='skill-add-interact'>
          You must be signed in to add the skill
        </ReactTooltip>
      )}
    </div>
  )
}
