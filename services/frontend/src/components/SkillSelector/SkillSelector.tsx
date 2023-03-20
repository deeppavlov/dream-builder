import { FC } from 'react'
import SkillSelectorLogo from '../../assets/icons/skill_selectors.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { usePreview } from '../../Context/PreviewProvider'
import { IStackElement } from '../../types/types'
import { Skill } from './Skill'
import { ISkillSelector } from '../../types/types'
import { WaitForNextRelease } from '../Stack/WaitForNextRelease'
import s from './SkillSelector.module.scss'

interface Props {
  skillSelectors: IStackElement[]
}
export const SkillSelector: FC<Props> = ({ skillSelectors }) => {
  const { isPreview } = usePreview()
  const customizable = skillSelectors?.filter(skill => skill.is_customizable)
  const nonCustomizable = skillSelectors?.filter(
    skill => !skill.is_customizable
  )

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={SkillSelectorLogo} className={s.icon} />
            <p className={s.type}>Skill Selector</p>
          </div>
        </div>
      </div>
      <AddButtonStack disabled={true} text='Add Skill Selector' />
      <form onSubmit={formSubmitHandler}>
        <Accordion closed title='Customizable'>
          <div className={s.element}>
            <WaitForNextRelease />
            {customizable?.map((skill, i) => (
              <RadioButton
                key={skill.name + i}
                id={skill.name}
                value={skill.name}
                name='skill_selector'
                // checked={skillSelectors?.length === 1}
                htmlFor={skill.name}>
                <Skill skill={skill} isPreview={isPreview} />
              </RadioButton>
            ))}
          </div>
        </Accordion>
        <Accordion title='Non-customizable'>
          <div className={s.element}>
            {!nonCustomizable?.length ? (
              <RadioButton
                id='All Skills'
                value='All Skills'
                name='skill_selector'
                htmlFor='All Skills'
                checked={true}
                disabled={isPreview}>
                <Skill
                  skill={{
                    name: 'all_skills',
                    display_name: 'All Skills',
                    description: 'All Skills',
                    is_customizable: false,
                    author: 'DeepPavlov',
                    component_type: null,
                    date_created: null,
                    execution_time: '0',
                    gpu_usage: '0',
                    model_type: null,
                    ram_usage: '0',
                  }}
                  isPreview={isPreview}
                />
              </RadioButton>
            ) : (
              nonCustomizable?.map((skill, i) => (
                <>
                  <RadioButton
                    key={skill.name + i}
                    id={skill.name}
                    value={skill.name}
                    name='skill_selector'
                    checked
                    htmlFor={skill.name}>
                    <Skill skill={skill} isPreview={isPreview} />
                  </RadioButton>
                </>
              ))
            )}
          </div>
        </Accordion>
      </form>
    </div>
  )
}
