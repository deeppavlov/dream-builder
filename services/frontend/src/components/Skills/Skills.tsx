import { FC } from 'react'
import SkillsLogo from '../../assets/icons/skills.svg'
import { usePreview } from '../../context/PreviewProvider'
import { ISkill } from '../../types/types'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { trigger } from '../../utils/events'
import { SkillElement } from './SkillElement'
import s from './Skills.module.scss'
interface SkillsStackProps {
  skills: ISkill[]
}

export const Skills: FC<SkillsStackProps> = ({ skills }) => {
  const { isPreview } = usePreview()

  const customizable = skills?.filter(skill => skill?.is_customizable)
  const nonCustomizable = skills?.filter(skill => !skill?.is_customizable)

  const handleAddClick = () => {
    trigger('SkillsListModal', {})
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
        <Accordion isActive title='Customizable'>
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
        <Accordion isActive title='Non-Customizable'>
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
