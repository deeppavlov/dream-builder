import classNames from 'classnames/bind'
import Calendar from '@assets/icons/calendar.svg'
import Button from '../../ui/Button/Button'
import { SkillAvailabilityType, SkillInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import ResourcesTable from '../ResourcesTable/ResourcesTable'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import React, { FC, useId, useState } from 'react'
import { usePreview } from '../../context/PreviewProvider'
import { Kebab } from '../../ui/Kebab/Kebab'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import SkillCardToolTip from '../SkillCardToolTip/SkillCardToolTip'
import triggerSkillSidePanel from '../../utils/triggerSkillSidePanel'
import s from './SkillCard.module.scss'

export interface SkillCardProps extends SkillInfoInterface {
  type: SkillAvailabilityType
  big?: boolean
  checkbox?: boolean
  disabledMsg?: string
}

export const SkillCard: FC<SkillCardProps> = ({
  type,
  name,
  display_name,
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
}) => {
  const skill = {
    name,
    display_name,
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
  const [disabled, setDisabled] = useState<boolean>(false)
  const ResValues = (): { name: string; value: string }[] =>
    type === 'public'
      ? [
          { name: 'RAM', value: ram },
          { name: 'GPU', value: gpu },
          {
            name: 'Execution time',
            value: executionTime.split(' ')[0] + ' s',
          },
        ]
      : [
          { name: 'RAM', value: ram },
          { name: 'Execution time', value: executionTime + ' s' },
        ]
  const { isPreview } = usePreview()
  const tooltipId = useId()
  let cx = classNames.bind(s)

  const sliderHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisabled(disabled => !disabled)
  }

  const handleSkillCardClick = (e: React.MouseEvent) =>
    triggerSkillSidePanel({ skill, type, activeTab: 'Properties' })

  const handleAddSkillBtnClick = (e: React.MouseEvent) => {
    trigger('CreateSkillDistModal', skill)
    e.stopPropagation()
  }

  const handleEditBtnClick = (e: React.MouseEvent) => {
    triggerSkillSidePanel({ skill, type, activeTab: 'Editor' })
    e.stopPropagation()
  }

  return (
    <>
      <div
        className={cx(
          'card',
          `${type}Card`,
          big && 'bigCard',
          disabled && 'disabled'
        )}
        onClick={handleSkillCardClick}>
        <div className={s.header}>
          <p className={s.botName}>{name ?? 'Name of The Skill'} </p>
          {type == 'your' && (
            <ToggleButton disabled={isPreview} sliderHandler={sliderHandler} />
          )}
        </div>
        <div className={s.body}>
          <div className={s.top}>
            <div className={s.type}>
              <img
                className={s.typeLogo}
                src={`./src/assets/icons/${componentTypeMap[skillType]}.svg`}
              />
              <p className={cx('typeText', skillType)}>
                {skillType ?? 'Type of Skill'}
              </p>
            </div>
            <div className={s.name}>
              <img className={s.companyLogo} src={authorImg} />
              <p className={s.companyName}>{author}</p>
            </div>
            <div
              className={s.description}
              data-for='descriptionTooltip'
              data-tip={desc}>
              {/* <ReactTooltip
                id='descriptionTooltip'
                effect='solid'
                className={s.tooltips}
                delayShow={500}
              /> */}
              <div className={s.descriptionText}>
                {desc ?? 'Lorem ipsum dolores est'}
              </div>
            </div>
            <div className={s.info}>
              <div className={s.date}>
                <img className={s.icon} src={Calendar} />
                <p className={s.dateText}>{dateCreated ?? '27.10.2022'}</p>
              </div>
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
                    props={{
                      onClick: handleEditBtnClick,
                      disabled: isPreview,
                    }}>
                    Edit
                  </Button>
                </div>

                <Kebab tooltipId={tooltipId} theme='card' />
              </>
            )}
          </div>
        </div>
      </div>

      <SkillCardToolTip
        skill={skill}
        tooltipId={tooltipId}
        isPreview={isPreview}
      />
      {/* {disabledMsg && (
        <ReactTooltip
          place='bottom'
          effect='solid'
          className='tooltips'
          arrowColor='#8d96b5'
          delayShow={1000}
          id='skill-add-interact'>
          You must be signed in to add the skill
        </ReactTooltip>
      )} */}
    </>
  )
}
