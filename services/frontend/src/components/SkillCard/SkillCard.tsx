import React, { FC, useId, useState } from 'react'
import classNames from 'classnames/bind'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Calendar from '@assets/icons/calendar.svg'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import Button from '../../ui/Button/Button'
import { SkillAvailabilityType, SkillInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import ResourcesTable from '../ResourcesTable/ResourcesTable'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import { usePreview } from '../../context/PreviewProvider'
import { Kebab } from '../../ui/Kebab/Kebab'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import triggerSkillSidePanel from '../../utils/triggerSkillSidePanel'
import SkillCardToolTip from '../SkillCardToolTip/SkillCardToolTip'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { dateToUTC } from '../../utils/dateToUTC'
import { srcForIcons } from '../../utils/srcForIcons'
import s from './SkillCard.module.scss'

export interface SkillCardProps {
  skill: SkillInfoInterface
  type: SkillAvailabilityType
  big?: boolean
  disabledMsg?: string
}

export const SkillCard: FC<SkillCardProps> = ({
  disabledMsg,
  big,
  type,
  skill,
}) => {
  const {
    name,
    display_name,
    author,
    description,
    date_created,
    ram_usage,
    gpu_usage,
    execution_time,
    component_type,
  } = skill
  const [disabled, setDisabled] = useState<boolean>(false)
  // const ResValues = (): { name: string; value: string }[] =>
  //   type === 'public'
  //     ? [
  //         { name: 'RAM', value: ram_usage },
  //         { name: 'GPU', value: gpu_usage },
  //         {
  //           name: 'Execution time',
  //           value: execution_time.split(' ')[0] + ' s',
  //         },
  //       ]
  //     : [
  //         { name: 'RAM', value: ram_usage },
  //         { name: 'Execution time', value: execution_time + ' s' },
  //       ]
  const dateCreated = dateToUTC(date_created)
  const { isPreview } = usePreview()
  const tooltipId = useId()
  let cx = classNames.bind(s)

  const handleToggle = (e: React.MouseEvent) => {
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
  const nameForComponentType = componentTypeMap[component_type]
  const srcForComponentType = srcForIcons(nameForComponentType)
  return (
    <div
      className={cx(
        'card',
        `${type}Card`,
        big && 'bigCard',
        disabled && 'disabled'
      )}
      onClick={handleSkillCardClick}>
      <div className={s.header}>
        <p className={s.botName}>{display_name ?? '------'} </p>
        {type == 'your' && (
          <ToggleButton disabled={isPreview} handleToggle={handleToggle} />
        )}
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.type}>
            <img className={s.typeLogo} src={srcForComponentType} />
            <p className={cx('typeText', nameForComponentType)}>
              {component_type ?? '------'}
            </p>
          </div>
          <div className={s.name}>
            <img className={s.companyLogo} src={DeepPavlovLogo} />
            <p className={s.companyName}>{author ?? '------'}</p>
          </div>
          <div
            className={s.description}
            data-for='descriptionTooltip'
            data-tip={description}>
            <ReactTooltip
              id='descriptionTooltip'
              className={s.tooltips}
              delayShow={500}
            />
            <div className={s.descriptionText}>{description ?? '------'}</div>
          </div>

        <span className={s.separator} />
          <div className={s.info}>
            <div className={s.date}>
              <img className={s.icon} src={Calendar} />
              <p className={s.dateText}>{dateCreated ?? '------'}</p>
            </div>
          </div>
        </div>
        {/* <div className={s.middle}>
          <ResourcesTable values={ResValues()} />
        </div> */}
        <div className={s.bottom}>
          {type === 'public' ? (
            <div className={s.btns} data-tip data-for='skill-add-interact'>
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
                className={s.btns}
                data-tip
                data-tooltip-id={'editSkill' + skill.name}>
                <Button
                  theme='primary'
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
              <SkillCardToolTip
                skill={skill}
                tooltipId={tooltipId}
                isPreview={isPreview}
              />
            </>
          )}
        </div>
      </div>
      {isPreview && (
        <BaseToolTip
          id={'editSkill' + name}
          content='You must be signed in to edit the skill'
          theme='small'
        />
      )}
    </div>
  )
}
