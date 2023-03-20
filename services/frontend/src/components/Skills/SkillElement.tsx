import { FC, useId, useState } from 'react'
import classNames from 'classnames/bind'
import { ISkill } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import { componentTypeMap } from '../../Mapping/componentTypeMap'
import SkillStackToolTip from '../SkillStackToolTip/SkillStackToolTip'
import { srcForIcons } from '../../utils/srcForIcons'
import s from './SkillElement.module.scss'

interface SkillProps {
  skill: ISkill
  isPreview: boolean
}

export const SkillElement: FC<SkillProps> = ({ skill, isPreview }) => {
  const [disabled, setDisabled] = useState<boolean>(false)
  let tooltipId = useId()
  const cx = classNames.bind(s)

  const handleToggle = (e: React.MouseEvent) =>
    setDisabled(disabled => !disabled)

  return (
    <div className={cx('element', disabled && 'disabled')}>
      <div className={s.left}>
        <div className={s.top}>
          <img
            src={srcForIcons(componentTypeMap[skill?.component_type!])}
            className={s.icon}
          />
          <p className={s.name}>{skill?.display_name || '------'}</p>
        </div>
      </div>
      <div className={s.right}>
        <ToggleButton disabled={isPreview} handleToggle={handleToggle} />
        <Kebab tooltipId={tooltipId} />
        <SkillStackToolTip
          tooltipId={tooltipId}
          skill={skill}
          isCustomizable={skill?.is_customizable}
          isPreview={isPreview}
        />
      </div>
    </div>
  )
}
