import { FC } from 'react'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import SkillsLogo from '../../assets/icons/skills.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Element } from './Element'
import { countResources } from '../../utils/countResources'
import { usePreview } from '../../Context/PreviewProvider'
import { IStackElement } from '../../types/types'
import s from './Skills.module.scss'

interface SkillsStackProps {
  skills: IStackElement[]
}

export const Skills: FC<SkillsStackProps> = ({ skills }) => {
  const { isPreview } = usePreview()

  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={SkillsLogo} className={s.icon} />
            <p className={s.type}>Skills</p>
          </div>
          {/* <Kebab disabled={isPreview} dataFor='all_skills' /> */}
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {(skills &&
              countResources(skills, 'ram_usage') +
                ' | ' +
                countResources(skills, 'gpu_usage')) ||
              '0.00 GB RAM | 0.00 GB GPU'}
          </p>
        </div>
      </div>
      <AddButtonStack disabled={isPreview} text='Add Skills' />
      <div className={s.elements}>
        <Accordion title='Customizable'>
          {skills?.map((skill, i) => {
            if (skill.is_customizable) {
              return (
                <Element
                  key={skill.name + i}
                  skill={skill}
                  isPreview={isPreview}
                />
              )
            }
          })}
        </Accordion>
        <Accordion title='Non-customizable'>
          {skills?.map((skill, i) => {
            if (!skill.is_customizable) {
              return (
                <Element
                  key={skill.name + i}
                  skill={skill}
                  isPreview={isPreview}
                />
              )
            }
          })}
        </Accordion>
      </div>
    </div>
  )
}
