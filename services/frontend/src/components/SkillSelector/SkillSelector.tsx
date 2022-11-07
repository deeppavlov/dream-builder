import { KebabButton } from '../Annotators/components/KebabButton'
import { Skill } from './components/Skill'
import s from './SkillSelector.module.scss'

export const SkillSelector = () => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <span className={s.icon} />
            <h5>Skill Selector</h5>
          </div>
          <KebabButton />
        </div>
      </div>
      <button className={s.add_btn}>
        <span className={s.icon} />
        <p>Add Skill Selector</p>
      </button>
      <Skill title='Rule Base Selector' />
      <Skill title='Default' />
    </div>
  )
}
