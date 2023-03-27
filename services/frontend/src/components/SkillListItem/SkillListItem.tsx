import { FC, useId, useRef, useState } from 'react'
import classNames from 'classnames/bind'
import { Kebab } from '../../ui/Kebab/Kebab'
import { trigger } from '../../utils/events'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import SkillSidePanel from '../SkillSidePanel/SkillSidePanel'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import { srcForIcons } from '../../utils/srcForIcons'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import SkillCardToolTip from '../SkillCardToolTip/SkillCardToolTip'
import { usePreview } from '../../context/PreviewProvider'
import { dateToUTC } from '../../utils/dateToUTC'
import { timeToUTC } from '../../utils/timeToUTC'
import { ISkill, SkillAvailabilityType } from '../../types/types'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import Button from '../../ui/Button/Button'
import { ReactComponent as Add } from '../../assets/icons/add.svg'
import { ReactComponent as Properties } from '../../assets/icons/properties.svg'
import toast from 'react-hot-toast'
import s from './SkillListItem.module.scss'
import triggerSkillSidePanel from '../../utils/triggerSkillSidePanel'

interface SkillListItemProps {
  skill: ISkill
  type: SkillAvailabilityType
  forModal?: boolean
}

export const SkillListItem: FC<SkillListItemProps> = ({
  skill,
  forModal,
  type,
}) => {
  const date = dateToUTC(skill?.date_created)
  const time = timeToUTC(new Date(skill?.date_created))
  const [disabled, setDisabled] = useState<boolean>(false)
  const tooltipId = useId()
  const { isPreview } = usePreview()
  const nameForComponentType = componentTypeMap[skill?.component_type!]
  const srcForComponentType = srcForIcons(nameForComponentType)
  const skillListItemRef = useRef(null)
  let cx = classNames.bind(s)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisabled(disabled => !disabled)
  }
  const handleSkillListItemClick = (e: React.MouseEvent) => {
    triggerSkillSidePanel({
      parent: skillListItemRef,
      skill,
      type,
      activeTab: 'Properties',
    })
  }
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    toast.success('Successfully Added!', { id: 'addSkill' })
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
      onClick={handleSkillListItemClick} ref={skillListItemRef}>
      <td className={s.td}>
        <div className={s.name}>
          <p className={s.skillName}>{skill?.display_name || '------'}</p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.type}>
          <img className={s.typeLogo} src={srcForComponentType} />
          <p className={cx('typeText', nameForComponentType)}>
            {skill?.component_type || '------'}
          </p>
        </div>
      </td>
      <td className={s.td}>
        <div
          className={s.description}
          data-tip
          data-tooltip-id={'skillTableDesc' + tooltipId}>
          {skill?.description}
          <BaseToolTip
            id={'skillTableDesc' + tooltipId}
            content={skill?.description}
            theme='description'
          />
        </div>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{date || 'Empty'}</p>
          <p className={s.time}>{time || 'Empty'}</p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          {forModal ? (
            <>
              <Button
                theme='primary'
                small
                withIcon
                props={{ onClick: handleAddClick }}>
                <Add />
              </Button>
              <Button
                theme='secondary'
                small
                withIcon
                props={{ onClick: handleSkillListItemClick }}>
                <Properties />
              </Button>
            </>
          ) : (
            <>
              <ToggleButton
                handleToggle={!isPreview && handleToggle}
                disabled={isPreview}
              />
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
