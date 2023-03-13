import { FC, useId } from 'react'
import { IContextMenu, IStackElement } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import SkillSelectorStackToolTip from '../SkillSelectorStackToolTip/SkillSelectorStackToolTip'
import s from './Skill.module.scss'

interface SelectorProps extends IContextMenu {
  skill: IStackElement
}

export const Skill: FC<SelectorProps> = ({ skill, isPreview }) => {
  const cleanTitle = capitalizeTitle(skill.display_name)
  const tooltipId = useId()

  return (
    <div className={s.skill}>
      <div className={s.left}>
        <p className={s.name}>{cleanTitle}</p>
      </div>
      {skill.is_customizable && (
        <div className={s.arrow}>
          <Kebab tooltipId={tooltipId} />
          <SkillSelectorStackToolTip
            tooltipId={tooltipId}
            skill={skill}
            isPreview={isPreview}
          />
        </div>
      )}
    </div>
  )
}
