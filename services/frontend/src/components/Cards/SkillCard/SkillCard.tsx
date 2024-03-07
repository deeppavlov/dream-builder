import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import React, { FC, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import Calendar from 'assets/icons/calendar.svg'
import { RoutesList } from 'router/RoutesList'
import { ISkill, SkillAvailabilityType, TLocale } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { TOOLTIP_DELAY } from 'constants/constants'
import { componentTypeMap } from 'mapping/componentTypeMap'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import { consts } from 'utils/consts'
import { dateToUTC } from 'utils/dateToUTC'
import { trigger } from 'utils/events'
import triggerSkillSidePanel from 'utils/triggerSkillSidePanel'
import { Button, Kebab } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { BaseToolTip, SkillCardToolTip, StatusToolTip } from 'components/Menus'
import s from './SkillCard.module.scss'

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
  const { t, i18n } = useTranslation()
  const [disabled, setDisabled] = useState<boolean>(false)
  const dateCreated = dateToUTC(skill?.date_created, i18n.language as TLocale)
  const { isPreview } = usePreview()
  const tooltipId = useId()
  const { UIOptions } = useUIOptions()
  const { name: distRoutingName } = useParams()
  const activeSKillId = UIOptions[consts.ACTIVE_SKILL_SP_ID]
  const isActive = skill.id === activeSKillId
  const nav = useNavigate()
  const { skillsPropsOpened, skillEditorOpened } = useGaSkills()
  const nameForComponentType = componentTypeMap[skill?.component_type!]
  let cx = classNames.bind(s)
  const isDummy = skill.name === 'dummy_skill'

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisabled(disabled => !disabled)
  }

  const handleSkillCardClick = (e: React.MouseEvent) => {
    if (
      document
        .querySelector(`[data-tooltip-id="${tooltipId}"]`)
        ?.contains(e.target as Node)
    ) {
      return
    }
    !isActive && skillsPropsOpened('card_click', skill)
    triggerSkillSidePanel({
      skill,
      visibility: type,
      activeTab: 'properties',
      isOpen: !isActive,
      distName: distRoutingName || '',
    })
  }

  const handleAddSkillBtnClick = (e: React.MouseEvent) => {
    trigger('CreateSkillDistModal', { skill })
    e.stopPropagation()
  }

  const handleEditBtnClick = (e: React.MouseEvent) => {
    skillEditorOpened('skill_block', skill)
    if (skill.component_type === ('Generative' as any)) {
      nav(
        generatePath(RoutesList.editor.skillEditor, {
          name: distRoutingName as string,
          skillId: skill.component_id,
        } as any)
      )
      e.stopPropagation()
      return
    }

    triggerSkillSidePanel({
      skill,
      visibility: type,
      activeTab: 'details',
      distName: distRoutingName || '',
    })
    e.stopPropagation()
  }

  return (
    <div
      className={cx(
        'card',
        `${type}Card`,
        forGrid && 'forGrid',
        disabled && 'disabled'
      )}
      onClick={handleSkillCardClick}
      data-active={isActive}
    >
      <div className={s.header}>
        <p className={s.botName}>
          {isDummy ? t('cards.skill.dummy') : skill?.display_name ?? '------'}{' '}
        </p>
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.type}>
            <SvgIcon
              iconName={nameForComponentType}
              svgProp={{ className: s.typeLogo }}
            />
            <p className={cx('typeText', nameForComponentType)}>
              {isDummy
                ? t('cards.skill.fallback')
                : t('cards.skill.generative')}
            </p>
          </div>
          <div
            className={s.description}
            data-tip
            data-tooltip-id={'skillCardDesc' + tooltipId}
          >
            <div className={s.descriptionText}>
              {isDummy
                ? t('cards.skill.dummyDescription')
                : skill?.description ?? 'Empty'}
            </div>
          </div>
          <div className={s.info}>
            <div className={s.date}>
              <img className={s.icon} src={Calendar} />
              <p className={s.dateText}>{dateCreated ?? '------'}</p>
              <StatusToolTip name='skill' skill={skill} />
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
                {t('card_btns.add')}
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
                  {t('card_btns.edit')}
                </Button>
              </div>
              <Kebab disabled={disabled} tooltipId={tooltipId} theme='card' />
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
          delayShow={TOOLTIP_DELAY}
          id={'editSkill' + tooltipId}
          content={t('cards.skill.tooltips.clone_for_edit')}
          theme='small'
        />
      )}
    </div>
  )
}
