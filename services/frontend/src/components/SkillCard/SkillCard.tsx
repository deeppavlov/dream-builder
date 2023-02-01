import ReactTooltip from 'react-tooltip'
import classNames from 'classnames/bind'
import Calendar from '../../assets/icons/calendar.svg'
import CompanyLogo from '../../assets/icons/pavlovInCard.svg'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './SkillCard.module.scss'
import Button from '../../ui/Button/Button'
import { BotAvailabilityType, SkillInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import ResourcesTable from '../ResourcesTable/ResourcesTable'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import React, { useId, useState } from 'react'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import SkillSidePanel from '../SkillSidePanel/SkillSidePanel'
import { nanoid } from 'nanoid'

export interface SkillCardProps extends SkillInfoInterface {
  type: BotAvailabilityType
  big?: boolean
  checkbox?: boolean
  disabledMsg?: string
}

export const SkillCard = ({
  type,
  name,
  desc,
  botName,
  author,
  authorImg,
  dateCreated,
  version,
  ram,
  gpu,
  space,
  executionTime,
  skillType,
  checkbox,
  big,
  disabledMsg,
}: SkillCardProps) => {
  const skill = {
    name,
    botName,
    author,
    authorImg,
    desc,
    dateCreated,
    version,
    ram,
    gpu,
    space,
    executionTime,
    skillType,
  }
  const [disabled, setDisabled] = useState(true)
  const ResValues = (): { name: string; value: string }[] =>
    type === 'public'
      ? [
          { name: 'RAM', value: ram },
          { name: 'GPU', value: gpu },
          { name: 'Execution time', value: executionTime },
        ]
      : [
          { name: 'RAM', value: ram },
          { name: 'Execution time', value: executionTime },
        ]
  const sliderHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisabled(disabled => !disabled)
  }
  const handleSkillCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    trigger(BASE_SP_EVENT, {
      children: <SkillSidePanel key={skill.name} skill={skill} />,
    })
  }

  const handleAddSkillBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    trigger('CreateSkillDistModal', skill)
  }

  const handleEditBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    trigger('SkillPromptModal', { skill: skill})
  }

  let cx = classNames.bind(s)
  return (
    <div
      className={cx('card', `${type}Card`, big && 'bigCard')}
      onClick={handleSkillCardClick}>
      <div className={s.header}>
        <p className={s.botName}>{name ?? 'Name of The Skill'} </p>
        {type == 'your' && <ToggleButton sliderHandler={sliderHandler} />}
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
            <p className={s.companyName}>{botName ?? 'Name of The Bot'}</p>
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
          <ResourcesTable values={ResValues()} />
        </div>
        <div className={s.bottom}>
          {type === 'public' ? (
            <div
              data-tip
              data-for='skill-add-interact'
              style={{ width: '100%' }}>
              <Button
                theme='primary'
                small
                long
                props={{
                  disabled: disabledMsg !== undefined,
                  onClick: handleAddSkillBtnClick,
                }}>
                Add
              </Button>
            </div>
          ) : (
            <>
              <div
                data-tip
                data-for='skill-edit-interact'
                style={{ width: '100%' }}>
                <Button
                  theme='secondary'
                  long
                  small
                  props={{ onClick: handleEditBtnClick }}>
                  Edit
                </Button>
              </div>
              <KebabButton dataFor='customizable_skill' />
            </>
          )}
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
