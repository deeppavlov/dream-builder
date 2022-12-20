import SkillSelectorLogo from '../../assets/icons/skill_selector.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Kebab } from '../../ui/Kebab/Kebab'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { Skill } from './Skill'
import s from './SkillSelector.module.scss'

export const SkillSelector = () => {
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
      <form
        onSubmit={e => {
          e.preventDefault()
        }}>
        <Accordion title='Customizable'>
          <div
            style={{
              backgroundColor: '#fff',
              width: '100%',
              padding: '0px 12px',
            }}>
            <RadioButton
              id='rule_based'
              name='skill_selector'
              htmlFor='rule_based'>
              <Skill title='Rule Based' />
            </RadioButton>
            <RadioButton
              id='single_skill'
              name='skill_selector'
              htmlFor='single_skill'>
              <Skill title='Single Skill' />
            </RadioButton>
            <RadioButton
              id='multiple_skill'
              name='skill_selector'
              htmlFor='multiple_skill'>
              <Skill title='Multiple Skill' />
            </RadioButton>
          </div>
        </Accordion>
        <Accordion title='Non-customizable'>
          <div style={{ padding: '0px 12px' }}>
            <RadioButton
              id='all_skill'
              name='skill_selector'
              htmlFor='all_skill'>
              <Skill title='All Skill' />
            </RadioButton>
          </div>
        </Accordion>
      </form>
    </div>
  )
}
