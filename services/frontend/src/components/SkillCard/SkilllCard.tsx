import ReactTooltip from 'react-tooltip'
import classNames from 'classnames/bind'
import Calendar from '../../assets/icons/calendar.svg'
import CompanyLogo from '../../assets/icons/pavlovInCard.svg'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './SkillCard.module.scss'
import Button from '../../ui/Button/Button'
import { SkillInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'

export interface SkillCardProps extends SkillInfoInterface {
  checkbox?: boolean
  disabledMsg?: string
}

export const SkillCard = ({
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
}: SkillCardProps) => {
  let cx = classNames.bind(s)
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

  const handleAddSkillBtnClick = (e: any) => {
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
    <div className={s.card} onClick={handleSkillCardClick}>
      <div className={s.header}>
        <p className={s.botName}>{name ?? 'Name of The Skill'} </p>
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.type}>
            <img
              className={s.typeLogo}
              src={`./src/assets/icons/${skillType}.svg`}
            />
            <p className={cx('typeText', skillType)}>
              {skillType ?? 'Type of Skill'}
            </p>
          </div>
          <div className={s.name}>
            <img className={s.companyLogo} src={CompanyLogo} />
            <p className={s.companyName}>{author ?? 'Name of The Company'}</p>
          </div>
          <div
            className={s.description}
            data-for='descriptionTooltip'
            data-tip={desc}>
            <ReactTooltip
              id='descriptionTooltip'
              effect='solid'
              className={s.tooltips}
              delayShow={500}
            />
            <div className={s.descriptionText}>
              {desc ?? 'Lorem ipsum dolores est'}
            </div>
          </div>
          <div className={s.info}>
            <div className={s.date}>
              <img className={s.icon} src={Calendar} />
              <p className={s.dateText}>{dateCreated ?? '27.10.2022'}</p>
            </div>
            <SmallTag theme='version'>v{version || '0.0.0'}</SmallTag>
          </div>
        </div>
        <span className={s.separator} />
        <div className={s.middle}>
          <ul className={s.params}>
            <li>
              <p className={s.item}>RAM</p>
              <p className={s.units}>{ram ?? '0.0GB'}</p>
            </li>
            <li>
              <p className={s.item}>GPU</p>
              <p className={s.units}>{gpu ?? '0.0GB'}</p>
            </li>
            <li>
              <p className={s.item}>Execution Time</p>
              <p className={s.units}>{executionTime + 's' || '0.0s'}</p>
            </li>
          </ul>
        </div>
        <div className={s.bottom}>
          {/* <CreateAssistantModal data-tip data-for='skill-add-interact'>
            Add Skill
          </CreateAssistantModal> */}
          <div data-tip data-for='skill-add-interact' style={{ width: '100%' }}>
            <Button
              theme='primary'
              small
              long
              props={{
                disabled: disabledMsg !== undefined,
                onClick: handleAddSkillBtnClick,
              }}>
              Add Skill
            </Button>
          </div>
        </div>
      </div>

      {disabledMsg && (
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
