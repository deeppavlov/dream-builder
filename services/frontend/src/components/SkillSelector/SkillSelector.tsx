import SkillSelectorLogo from '../../assets/icons/skill_selector.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
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
          <KebabButton />
        </div>
      </div>
      <AddButtonStack disabled={true} text='Add Skill Selector' />
      <Accordion title='Customizable'>
        <form>
          <Skill title='Rule Based' />
          <Skill title='Single Skill' />
          <Skill title='Multiple Skill' />
        </form>
      </Accordion>
      <Accordion title='Non-customizable'>
        <Skill title='All Skills' />
      </Accordion>
    </div>
  )
}
