import { FC } from 'react'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import SkillsLogo from '../../assets/icons/skills.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Element } from './Element'
import { countResources } from '../../utils/countResources'
import { usePreview } from '../../context/PreviewProvider'
import { Skill } from '../../types/types'
import s from './Skills.module.scss'

interface SkillsStackProps {
  skills: [Skill]
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
        <Accordion title='Customizable'></Accordion>
        <Accordion title='Non-customizable'>
          {skills?.map((item: Skill, i: number) => {
            console.log(item)
            return (
              <Element
                key={i}
                isPreview={isPreview}
                skill={{
                  author: item?.author,
                  authorImg: DeepPavlovLogo,
                  name: item.name,
                  display_name: item?.display_name,
                  desc: item?.description,
                  component_type: item?.component_type,
                  model_type: item?.model_type,
                  version: item?.version,
                  ram_usage: item?.ram_usage,
                  gpu_usage: item?.gpu_usage,
                  execution_time: item?.execution_time,
                  isCustomizable: false,
                }}
              />
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}
