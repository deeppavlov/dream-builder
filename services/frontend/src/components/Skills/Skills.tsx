import { FC } from 'react'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import SkillsLogo from '../../assets/icons/skills.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Element } from './Element'
import { usePreview } from '../../context/PreviewProvider'
import { Component } from '../../types/types'
import { WaitForNextRelease } from '../Stack/WaitForNextRelease'
import s from './Skills.module.scss'

interface SkillsStackProps {
  skills: [Component]
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
        </div>
      </div>
      <AddButtonStack disabled={isPreview} text='Add Skills' />
      <div className={s.elements}>
        <Accordion closed title='Customizable'>
          <WaitForNextRelease />
        </Accordion>
        <Accordion title='Non-customizable'>
          {skills?.map((skill: Component, i: number) => {
            return <Element key={i} isPreview={isPreview} skill={skill} />
          })}
        </Accordion>
      </div>
    </div>
  )
}
