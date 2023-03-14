import { useId, useState } from 'react'
import classNames from 'classnames/bind'
import { Checkbox } from '../../ui/Checkbox/Checkbox'
import { Kebab } from '../../ui/Kebab/Kebab'
import { trigger } from '../../utils/events'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import SkillSidePanel from '../SkillSidePanel/SkillSidePanel'
import { componentTypeMap } from '../../Mapping/componentTypeMap'
import { srcForIcons } from '../../utils/srcForIcons'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './SkillListItem.module.scss'
import SkillCardToolTip from '../SkillCardToolTip/SkillCardToolTip'
import { usePreview } from '../../Context/PreviewProvider'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { ISkill } from '../../types/types'
import { dateToUTC } from '../../utils/dateToUTC'
import { timeToUTC } from '../../utils/timeToUTC'

interface Props {
  skill: ISkill
  checkbox?: boolean
  disabledMsg?: string
}

export const SkillListItem = ({ skill, checkbox, disabledMsg }: Props) => {
  const {
    name,
    display_name,
    description,
    component_type,
    date_created,
    model_type,
    ram_usage,
    gpu_usage,
    execution_time,
  } = skill
  const { isPreview } = usePreview()
  const [disabled, setDisabled] = useState<boolean>(false)
  const tooltipId = useId()
  let cx = classNames.bind(s)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisabled(disabled => !disabled)
  }
  const handleSkillListItemClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    trigger(BASE_SP_EVENT, {
      children: <SkillSidePanel key={skill.name} skill={skill} />,
    })
  }

  const handleAddBtnClick = (e: any) => {
    e.stopPropagation()
    trigger('SkillModal', {
      action: 'create',
      parent: skill,
    })
  }
  const nameForComponentType = componentTypeMap[component_type ?? '']
  const srcForComponentType = srcForIcons(nameForComponentType)

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
          <p className={s.skillName}>{display_name || 'Empty'}</p>
          <span className={s.params}>
            {`RAM ${ram_usage} | GPU ${gpu_usage} | DS ${execution_time}s`}
          </span>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.type}>
          <img className={s.typeLogo} src={srcForComponentType} />
          <p className={cx('typeText', nameForComponentType)}>
            {component_type || 'Empty'}
          </p>
        </div>
      </td>
      <td className={s.td}>
        <div
          className={s.description}
          data-tip
          data-tooltip-id={'skillTableDesc' + tooltipId}>
          {description}
          <BaseToolTip
            id={'skillTableDesc' + tooltipId}
            content={description}
            theme='description'
          />
        </div>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>
            {date_created ? dateToUTC(date_created) : 'Empty'}
          </p>
          <p className={s.time}>
            {date_created ? timeToUTC(date_created) : 'Empty'}{' '}
          </p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <ToggleButton handleToggle={handleToggle} />
          <Kebab tooltipId={'ctxMenu' + tooltipId} theme='card' />
          <SkillCardToolTip
            skill={skill}
            tooltipId={'ctxMenu' + tooltipId}
            isPreview={isPreview}
          />
          {/* <div data-tip data-for='skill-add-interact'>
            <button
              className={s.area}
              onClick={handleAddBtnClick}
              disabled={disabledMsg !== undefined}>
              <PlusLogo />
            </button>
          </div> */}
        </div>
      </td>
    </tr>
  )
}
