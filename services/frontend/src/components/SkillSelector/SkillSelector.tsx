import { FC } from 'react'
import SkillSelectorLogo from '../../assets/icons/skill_selectors.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { Skill } from './Skill'
import { usePreview } from '../../context/PreviewProvider'
import s from './SkillSelector.module.scss'

type SkillSelector = {
  name: string
  display_name: string
  author: string
  component_type: string
  model_type: string
  date_created: string | Date
  description: string
  is_customizable: boolean
  ram_usage: string
  gpu_usage: string
  execution_type: string
}

interface Props {
  skillSelectors: [SkillSelector]
}
export const SkillSelector: FC<Props> = ({ skillSelectors }) => {
  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault()
  }
  const { isPreview } = usePreview()
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
        <Accordion title='Customizable' />
        <Accordion title='Non-customizable'>
          <div className={s.element}>
            {!skillSelectors?.length ? (
              <RadioButton
                id={'All Skills'}
                name='skill_selector'
                htmlFor={'All Skills'}
                checked={true}
                disabled={isPreview}>
                <Skill title={'All Skills'} />
              </RadioButton>
            ) : (
              skillSelectors?.map((item: SkillSelector, i: number) => {
                return (
                  <RadioButton
                    key={i}
                    id={item?.name}
                    name='skill_selector'
                    checked={skillSelectors?.length === 1}
                    htmlFor={item?.display_name}>
                    <Skill title={item?.display_name} />
                  </RadioButton>
                )
              })
            )}
          </div>
        </Accordion>
      </form>
    </div>
  )
}
