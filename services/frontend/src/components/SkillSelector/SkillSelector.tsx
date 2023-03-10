import { FC } from 'react'
import SkillSelectorLogo from '../../assets/icons/skill_selectors.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { Skill } from './Skill'
import { usePreview } from '../../context/PreviewProvider'
import s from './SkillSelector.module.scss'
import { ISkillSelector } from '../../types/types'

interface Props {
  skillSelectors: ISkillSelector[]
}
export const SkillSelector: FC<Props> = ({ skillSelectors }) => {
  const { isPreview } = usePreview()

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
        <Accordion title='Customizable' />
        <Accordion title='Non-customizable'>
          <div className={s.element}>
            {!skillSelectors?.length ? (
              <RadioButton
                id='All Skills'
                value='All Skills'
                name='skill_selector'
                htmlFor='All Skills'
                checked={true}
                disabled={isPreview}>
                <Skill
                  withContextMenu={false}
                  isCustomizable={false}
                  skill={{
                    display_name: 'All Skills',
                    description: 'All Skills',
                  }}
                />
              </RadioButton>
            ) : (
              skillSelectors?.map((item: ISkillSelector, i: number) => (
                <>
                  <RadioButton
                    key={i}
                    id={item?.name}
                    value={item.name}
                    name='skill_selector'
                    checked={skillSelectors?.length === 1}
                    htmlFor={item?.name}>
                    <Skill
                      withContextMenu
                      isCustomizable={false}
                      skill={item}
                      isPreview={isPreview}
                    />
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
