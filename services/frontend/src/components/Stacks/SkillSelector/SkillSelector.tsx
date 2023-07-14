import { FC } from 'react'
import SkillSelectorLogo from 'assets/icons/skill_selectors.svg'
import { IStackElement } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { AddButtonStack } from 'components/Buttons'
import { Accordion } from 'components/Dropdowns'
import { WaitForNextRelease } from 'components/Stacks/WaitForNextRelease'
import { RadioSkill } from './RadioSkill'
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

  const formSubmitHandler = (e: React.FormEvent) => e.preventDefault()

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
        <Accordion isActive={customizable?.length > 0} title='Customizable'>
          <WaitForNextRelease />
          {customizable?.map((skill, i) => (
            <RadioSkill
              key={skill.name + i}
              id={skill.name}
              value={skill.name}
              name='skill_selector'
              // checked={skillSelectors?.length === 1}
              htmlFor={skill.name}
              skill={skill}
            />
          ))}
        </Accordion>
        <Accordion
          isActive={nonCustomizable?.length > 0}
          title='Non-customizable'
        >
          {!nonCustomizable?.length ? (
            <RadioSkill
              id='All Skills'
              value='All Skills'
              name='skill_selector'
              htmlFor='All Skills'
              defaultChecked
              disabled={isPreview}
              skill={{
                name: 'all_skills',
                display_name: 'All Skills',
                description: 'All Skills',
                is_customizable: false,
                author: 'DeepPavlov',
                component_type: null,
                date_created: '',
                execution_time: '0',
                gpu_usage: '0',
                model_type: null,
                ram_usage: '0',
              }}
            />
          ) : (
            nonCustomizable?.map((skill, i) => (
              <RadioSkill
                key={skill.name + i}
                id={skill.name}
                value={skill.name}
                name='skill_selector'
                defaultChecked={nonCustomizable?.length === 1}
                htmlFor={skill.name}
                skill={skill}
              />
            ))
          )}
        </Accordion>
      </form>
    </div>
  )
}
