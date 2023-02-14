import { FC } from 'react'
import SkillSelectorLogo from '../../assets/icons/skill_selectors.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { Skill } from './Skill'
import { usePreview } from '../../Context/PreviewProvider'
import s from './SkillSelector.module.scss'

interface SkillSelctorProps {
  skillSelectors: []
}
const formSubmitHandler = (e: React.FormEvent) => {
  e.preventDefault()
}
export const SkillSelector: FC<SkillSelctorProps> = ({ skillSelectors }) => {
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
              skillSelectors?.map((item: string, i: number) => {
                return (
                  <RadioButton
                    key={i}
                    id={item}
                    name='skill_selector'
                    htmlFor={item}>
                    <Skill title={capitalizeTitle(item)} />
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
