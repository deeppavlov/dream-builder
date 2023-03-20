import { FC } from 'react'
import SkillsLogo from '../../assets/icons/skills.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { SkillElement } from './SkillElement'
import { usePreview } from '../../context/PreviewProvider'
import { ISkill } from '../../types/types'
import s from './Skills.module.scss'
import { trigger } from '../../utils/events'
import { mockSkills } from '../../mocks/database/mockSkills'
interface SkillsStackProps {
  skills: ISkill[]
}

export const Skills: FC<SkillsStackProps> = ({ skills }) => {
  const { isPreview } = usePreview()

  const customizable = skills?.filter(skill => skill?.is_customizable)
  const nonCustomizable = skills?.filter(skill => !skill?.is_customizable)
  const handleAddClick = () => {
    trigger('SkillsListModal', { mockSkills })
  }
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={SkillsLogo} className={s.icon} />
            <p className={s.type}>Skills</p>
          </div>
        </div>
      </div>
      <AddButtonStack
        disabled={isPreview}
        text='Add Skills'
        onClick={handleAddClick}
      />
      <div className={s.elements}>
        <Accordion title='Customizable'>
          {customizable?.map((skill, i) => {
            return (
              <SkillElement
                key={skill.name + i}
                skill={skill}
                isPreview={isPreview}
              />
            )
          })}
        </Accordion>
        <Accordion title='Non-Customizable'>
          {nonCustomizable?.map((skill, i) => {
            return (
              <SkillElement
                key={skill.name + i}
                skill={skill}
                isPreview={isPreview}
              />
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}
