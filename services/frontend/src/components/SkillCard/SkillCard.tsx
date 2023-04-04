import React, { FC, useId, useRef, useState } from 'react'
import classNames from 'classnames/bind'
import Calendar from '@assets/icons/calendar.svg'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import Button from '../../ui/Button/Button'
import { ISkill, SkillAvailabilityType } from '../../types/types'
import { trigger } from '../../utils/events'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import { usePreview } from '../../context/PreviewProvider'
import { Kebab } from '../../ui/Kebab/Kebab'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import triggerSkillSidePanel from '../../utils/triggerSkillSidePanel'
import SkillCardToolTip from '../SkillCardToolTip/SkillCardToolTip'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { dateToUTC } from '../../utils/dateToUTC'
import { srcForIcons } from '../../utils/srcForIcons'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import Woman from '../../assets/icons/woman.png'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'
import s from './SkillCard.module.scss'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutesList } from '../../router/RoutesList'

export interface SkillCardProps {
  skill: ISkill
  type: SkillAvailabilityType
  forGrid?: boolean
  disabledMsg?: string
}

export const SkillCard: FC<SkillCardProps> = ({
  disabledMsg,
  forGrid,
  type,
  skill,
}) => {
  const [disabled, setDisabled] = useState<boolean>(false)
  const dateCreated = dateToUTC(skill?.date_created)
  const { isPreview } = usePreview()
  const tooltipId = useId()
  const skillCardRef = useRef(null)
  const { options } = useDisplay()
  const { name: distRoutingName } = useParams()
  const activeSKillId = options.get(consts.ACTIVE_SKILL_SP_ID)
  const nav = useNavigate()
  let cx = classNames.bind(s)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisabled(disabled => !disabled)
  }

  const handleSkillCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerSkillSidePanel({
      parent: skillCardRef,
      skill,
      type,
      activeTab: 'Properties',
    })
  }

  const handleAddSkillBtnClick = (e: React.MouseEvent) => {
    trigger('CreateSkillDistModal', { skill })
    e.stopPropagation()
  }

  const handleEditBtnClick = (e: React.MouseEvent) => {
    if (skill.component_type === 'Generative') {
      // trigger('SkillPromptModal', { skill, action: 'edit' })

      nav(
        generatePath(RoutesList.editor.skillEditor, {
          name: distRoutingName as string,
          skillId: skill.name,
        } as any)
      )
      // trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
      e.stopPropagation()
      return
    }

    triggerSkillSidePanel({ skill, type, activeTab: 'Editor' })
    e.stopPropagation()
  }
  const nameForComponentType = componentTypeMap[skill?.component_type!]
  const srcForComponentType = srcForIcons(nameForComponentType)

  return (
    <div
      className={cx(
        'card',
        `${type}Card`,
        forGrid && 'forGrid',
        disabled && 'disabled'
      )}
      onClick={handleSkillCardClick}
      ref={skillCardRef}
      data-active={skill.name === activeSKillId}
    >
      <div className={s.header}>
        <p className={s.botName}>{skill?.display_name ?? '------'} </p>
        {type == 'your' && (
          <ToggleButton disabled={isPreview} handleToggle={handleToggle} />
        )}
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.type}>
            <img className={s.typeLogo} src={srcForComponentType} />
            <p className={cx('typeText', nameForComponentType)}>
              {skill?.component_type ?? '------'}
            </p>
          </div>
          <div className={s.name}>
            <img className={s.companyLogo} src={Woman} />
            <p className={s.companyName}>
              {skill?.author == 'DeepPavlov'
                ? 'Dr. Xandra Smith'
                : skill?.author}
            </p>
          </div>
          <div
            className={s.description}
            data-tip
            data-tooltip-id={'skillCardDesc' + tooltipId}
          >
            <div className={s.descriptionText}>
              {skill?.description ?? 'Empty'}
            </div>
            <BaseToolTip
              id={'skillCardDesc' + tooltipId}
              content={skill?.description}
              theme='description'
            />
          </div>

          <span className={s.separator} />
          <div className={s.info}>
            <div className={s.date}>
              <img className={s.icon} src={Calendar} />
              <p className={s.dateText}>{dateCreated ?? '------'}</p>
            </div>
          </div>
        </div>
        <div className={s.bottom}>
          {type === 'public' ? (
            <div className={s.btns} data-tip data-for='skill-add-interact'>
              <Button
                theme='primary'
                small
                long
                props={{
                  disabled: disabled || disabledMsg !== undefined,
                  onClick: handleAddSkillBtnClick,
                }}
              >
                Add
              </Button>
            </div>
          ) : (
            <>
              <div
                className={s.btns}
                data-tip
                data-tooltip-id={'editSkill' + tooltipId}
                style={{ width: '100%' }}
              >
                <Button
                  theme='primary'
                  long
                  small
                  props={{
                    onClick: handleEditBtnClick,
                    disabled: disabled || isPreview || !skill?.is_customizable,
                  }}
                >
                  Edit
                </Button>
              </div>
              <Kebab
                disabled={disabled}
                tooltipId={'ctxMenu' + tooltipId}
                theme='card'
              />
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
