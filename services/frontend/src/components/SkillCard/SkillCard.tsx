import React, { FC, useId, useState } from 'react'
import classNames from 'classnames/bind'
import { Tooltip as ReactTooltip, Tooltip } from 'react-tooltip'
import Calendar from '@assets/icons/calendar.svg'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import Button from '../../ui/Button/Button'
import { ISkill, SkillAvailabilityType } from '../../types/types'
import { trigger } from '../../utils/events'
import ResourcesTable from '../ResourcesTable/ResourcesTable'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import { usePreview } from '../../Context/PreviewProvider'
import { Kebab } from '../../ui/Kebab/Kebab'
import { componentTypeMap } from '../../Mapping/componentTypeMap'
import triggerSkillSidePanel from '../../utils/triggerSkillSidePanel'
import SkillCardToolTip from '../SkillCardToolTip/SkillCardToolTip'
import s from './SkillCard.module.scss'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { dateToUTC } from '../../utils/dateToUTC'

export interface SkillCardProps {
  type: SkillAvailabilityType
  skill: ISkill
  big?: boolean
  checkbox?: boolean
  disabledMsg?: string
}

export const SkillCard = ({
  type,
  skill,
  big,
  checkbox,
  disabledMsg,
}: SkillCardProps) => {
  const {
    name,
    display_name,
    author,
    component_type,
    model_type,
    description,
    ram_usage,
    gpu_usage,
    execution_time,
    date_created,
  } = skill
  const [disabled, setDisabled] = useState<boolean>(false)
  const ResValues = (): { name: string; value: string }[] =>
    type === 'public'
      ? [
          { name: 'RAM', value: ram_usage },
          { name: 'GPU', value: gpu_usage },
          {
            name: 'Execution time',
            value: execution_time.split(' ')[0] + ' s',
          },
        ]
      : [
          { name: 'RAM', value: ram_usage },
          { name: 'Execution time', value: execution_time + ' s' },
        ]
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
        <p className={s.botName}>{display_name ?? 'Empty'} </p>
        {type == 'your' && (
          <ToggleButton disabled={isPreview} handleToggle={handleToggle} />
        )}
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.type}>
            <img
              className={s.typeLogo}
              src={`./src/assets/icons/${
                componentTypeMap[component_type ?? '']
              }.svg`}
            />
            <p
              className={cx(
                'typeText',
                componentTypeMap[component_type ?? '']
              )}>
              {component_type ?? 'Empty'}
            </p>
          </div>
          <div className={s.name}>
            <img className={s.companyLogo} src={DeepPavlovLogo} />
            <p className={s.companyName}>{author ?? 'Empty'}</p>
          </div>
          <div
            className={s.description}
            data-tip
            data-tooltip-id={'skillCardDesc' + tooltipId}>
            <div className={s.descriptionText}>{description ?? 'Empty'}</div>
            <BaseToolTip
              id={'skillCardDesc' + tooltipId}
              content={description}
              theme='description'
            />
          </div>
          <div className={s.info}>
            <div className={s.date}>
              <img className={s.icon} src={Calendar} />
              <p className={s.dateText}>
                {date_created ? dateToUTC(new Date(date_created)) : 'Empty'}
              </p>
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
                data-tooltip-id={'editSkill' + tooltipId}
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
              <Kebab tooltipId={'ctxMenu' + tooltipId} theme='card' />
              <SkillCardToolTip
                skill={skill}
                tooltipId={'ctxMenu' + tooltipId}
                isPreview={isPreview}
              />
            </>
          )}
        </div>
      </div>

      {isPreview && (
        <BaseToolTip
          id={'editSkill' + tooltipId}
          content='You need to clone the virtual assistant to edit'
          theme='small'
        />
      )}
    </div>
  )
}
