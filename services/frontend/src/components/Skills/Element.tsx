import { FC, useId, useState } from 'react'
import classNames from 'classnames/bind'
import { IContextMenu, Skill } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import SkillStackToolTip from '../SkillStackToolTip/SkillStackToolTip'
import s from './Element.module.scss'

interface SkillProps extends IContextMenu {
  skill: Skill
}

export const Element: FC<SkillProps> = ({
  skill,
  isCustomizable,
  isPreview,
}) => {
  const [disabled, setDisabled] = useState<boolean>(false)
  let tooltipId = useId()
  const cx = classNames.bind(s)

  const sliderHandler = () => setDisabled(disabled => !disabled)

  return (
    <div className={cx('element', disabled && 'disabled')}>
      <div className={s.left}>
        <div className={s.top}>
          <img
            src={`./src/assets/icons/${
              componentTypeMap[skill.component_type]
            }.svg`}
            className={s.icon}
          />
          <p className={s.name}>{skill?.display_name || 'some_skill'}</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {skill.ram_usage +
              ' RAM ' +
              '| ' +
              skill.execution_time +
              's Time' || '0.0 GB RAM | 0.00 s '}
          </p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab tooltipId={tooltipId} />
        <SkillStackToolTip
          tooltipId={tooltipId}
          skill={skill}
          isCustomizable={isCustomizable}
          isPreview={isPreview}
        />
        <ToggleButton disabled={isPreview} sliderHandler={sliderHandler} />
      </div>
    </div>
  )
}
