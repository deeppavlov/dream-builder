import classNames from 'classnames/bind'
import { FC, useId, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ReactComponent as Add } from '../../assets/icons/add.svg'
import { ReactComponent as Properties } from '../../assets/icons/properties.svg'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import { ISkill, SkillAvailabilityType } from '../../types/types'
import Button from '../../ui/Button/Button'
import { Kebab } from '../../ui/Kebab/Kebab'
import { consts } from '../../utils/consts'
import { dateToUTC } from '../../utils/dateToUTC'
import { trigger } from '../../utils/events'
import { srcForIcons } from '../../utils/srcForIcons'
import { timeToUTC } from '../../utils/timeToUTC'
import triggerSkillSidePanel from '../../utils/triggerSkillSidePanel'
import SkillCardToolTip from '../SkillCardToolTip/SkillCardToolTip'
import s from './SkillListItem.module.scss'

interface SkillListItemProps {
  skill: ISkill
  type: SkillAvailabilityType
  forModal?: boolean
  withoutDate?: boolean
  addFunc: (distName: string, id: number) => void | undefined
}

export const SkillListItem: FC<SkillListItemProps> = ({
  skill,
  forModal,
  type,
  withoutDate,
  addFunc,
}) => {
  const date = dateToUTC(skill?.date_created)
  const time = timeToUTC(new Date(skill?.date_created))
  const [disabled, setDisabled] = useState<boolean>(false)
  const tooltipId = useId()
  const { isPreview } = usePreview()
  const nameForComponentType = componentTypeMap[skill?.component_type!]
  const srcForComponentType = srcForIcons(nameForComponentType)
  const { options } = useDisplay()
  const activeSKillId = options.get(consts.ACTIVE_SKILL_SP_ID)
  const isActive = skill.id === activeSKillId
  const { state } = useLocation()
  let cx = classNames.bind(s)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisabled(disabled => !disabled)
  }
  const handleSkillListItemClick = (e: React.MouseEvent) => {
    triggerSkillSidePanel({
      skill,
      type,
      activeTab: 'Properties',
      isOpen: !isActive,
    })
  }
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    addFunc(state?.distName, skill?.id!)
  }
  const handleAddBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    trigger('SkillModal', {
      action: 'create',
      parent: skill,
    })
  }

  return (
    <tr
      className={cx('tr', disabled && 'disabled')}
      onClick={handleSkillListItemClick}
      data-active={skill.id === activeSKillId}
    >
      <td className={s.td}>
        <div className={s.name}>
          <p className={s.skillName}>{skill?.display_name || '------'}</p>
        </div>
      </td>
      <td className={s.td}>
        {skill?.component_type && (
          <div className={s.type}>
            <img className={s.typeLogo} src={srcForComponentType} />
            <p className={cx('typeText', nameForComponentType)}>
              {skill?.component_type || '------'}
            </p>
          </div>
        )}
      </td>
      <td className={s.td}>
        <div
          className={s.description}
          data-tip
          data-tooltip-id={'skillTableDesc' + tooltipId}
        >
          {skill?.description}
          {/* <BaseToolTip
            delayShow={TOOLTIP_DELAY}
            id={'skillTableDesc' + tooltipId}
            content={skill?.description}
            theme='description'
          /> */}
        </div>
      </td>
      {!withoutDate && (
        <td className={s.td}>
          <div className={s.date}>
            <p className={s.ddmmyyyy}>{date || 'Empty'}</p>
            <p className={s.time}>{time || 'Empty'}</p>
          </div>
        </td>
      )}
      <td className={s.td}>
        <div className={s.btns_area}>
          {forModal ? (
            <>
              <Button
                theme='primary'
                small
                withIcon
                props={{ onClick: handleAddClick }}
              >
                <Add />
              </Button>
              <Button
                theme='secondary'
                small
                withIcon
                props={{ onClick: handleSkillListItemClick }}
              >
                <Properties />
              </Button>
            </>
          ) : (
            <>
              {/* <ToggleButton handleToggle={handleToggle} disabled={isPreview} /> */}
              <Kebab tooltipId={'ctxMenu' + tooltipId} theme='card' />
            </>
          )}
          <SkillCardToolTip
            skill={skill}
            tooltipId={'ctxMenu' + tooltipId}
            isPreview={isPreview}
          />
        </div>
      </td>
    </tr>
  )
}
