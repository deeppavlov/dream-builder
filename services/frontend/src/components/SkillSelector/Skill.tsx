import { FC, useId } from 'react'
import { IContextMenu, ISkillSelector } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import SkillSelectorStackToolTip from '../SkillSelectorStackToolTip/SkillSelectorStackToolTip'
import s from './Skill.module.scss'

interface SelectorProps extends IContextMenu {
  skill: ISkillSelector
  withContextMenu: boolean
}

export const Skill: FC<SelectorProps> = ({
  skill,
  withContextMenu,
  isCustomizable,
  isPreview,
}) => {
  const cleanTitle = capitalizeTitle(skill.display_name)
  const tooltipId = useId()

  return (
    <div className={s.skill}>
      <div className={s.left}>
        <p className={s.name}>{cleanTitle}</p>
      </div>
      {withContextMenu && (
        <div className={s.arrow}>
          <Kebab tooltipId={tooltipId} />
          <SkillSelectorStackToolTip
            tooltipId={tooltipId}
            skill={skill}
            isCustomizable={isCustomizable}
            isPreview={isPreview}
          />
        </div>
      )}
    </div>
  )
}
