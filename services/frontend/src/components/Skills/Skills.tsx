import SkillsLogo from '../../assets/icons/skills.svg'
import { Accordeon } from '../../ui/Accordeon/Accordeon'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { Element } from './Element'
import s from './Skills.module.scss'

export const Skills = () => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={SkillsLogo} className={s.icon} />
            <p className={s.type}>Skills</p>
          </div>
          <KebabButton />
        </div>
        <div className={s.bottom}>
          <p className={s.data}>7.356 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>

      <AddButtonStack text='Add Skills' />
      <div className={s.elements}>
        <Accordeon title='Customizable'>
          <Element />
          <Element />
        </Accordeon>
        <Accordeon title='Non-customizable'>
          <Element />
          <Element />
        </Accordeon>
      </div>
    </div>
  )
}
