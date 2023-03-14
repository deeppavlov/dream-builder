import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FC, useId, useState } from 'react'
import classNames from 'classnames/bind'
import { Checkbox } from '../../ui/Checkbox/Checkbox'
import { Kebab } from '../../ui/Kebab/Kebab'
import { SkillInfoInterface } from '../../types/types'
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
import s from './SkillListItem.module.scss'

interface SkillListItemProps {
  checkbox?: boolean
  disabledMsg?: string
  skill: SkillInfoInterface
}

export const SkillListItem: FC<SkillListItemProps> = ({
  checkbox,
  skill,
  disabledMsg,
}) => {
  const dateCreated = dateToUTC(skill?.date_created)
  const time = timeToUTC(new Date(skill?.date_created))
  const [disabled, setDisabled] = useState<boolean>(false)
  const tooltipId = useId()
  const { isPreview } = usePreview()
  const nameForComponentType = componentTypeMap[skill?.component_type]
  const srcForComponentType = srcForIcons(nameForComponentType)
  let cx = classNames.bind(s)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisabled(disabled => !disabled)
  }
  const handleSkillListItemClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    trigger(BASE_SP_EVENT, {
      children: <SkillSidePanel key={skill?.name} skill={skill} />,
    })
  }

  const handleAddBtnClick = (e: any) => {
    e.stopPropagation()
    trigger('SkillModal', {
      action: 'create',
      parent: skill,
    })
  }

  return (
    <tr
      className={cx('tr', disabled && 'disabled')}
      onClick={handleSkillListItemClick}>
      {checkbox && (
        <td className={s.checkboxArea}>
          <Checkbox />
        </td>
      )}
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
          data-for='descriptionTooltip'
          data-tip={skill?.description}>
          <ReactTooltip
            id='descriptionTooltip'
            className={s.tooltips}
            delayShow={500}
          />
          {skill?.description || '------'}
        </div>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{dateCreated}</p>
          <p className={s.time}>{time || '------'} </p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <ToggleButton disabled={isPreview} handleToggle={handleToggle} />
          <Kebab tooltipId={tooltipId} theme='card' />
          <SkillCardToolTip
            skill={skill}
            tooltipId={tooltipId}
            isPreview={isPreview}
          />
        </div>
      </td>
      {disabledMsg && (
        <ReactTooltip
          place='bottom'
          className='tooltips'
          delayShow={1000}
          id='skill-add-interact'>
          {disabledMsg}
        </ReactTooltip>
      )}
    </tr>
  )
}
