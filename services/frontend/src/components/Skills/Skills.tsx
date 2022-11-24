import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { Element } from './Element'
import s from './Skills.module.scss'

export const Skills = () => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <span className={s.icon} />
            <h5>Skills</h5>
          </div>
          <KebabButton />
        </div>
        <div className={s.bottom}>
          <p className={s.data}>0 Gb RAM | 0.000 Gb GPU</p>
        </div>
      </div>
      <button className={s.add_btn}>
        <span className={s.icon} />
        <p>Add Skills</p>
      </button>
      <Element />
      <Element />
      <Element />
      <Element />
    </div>
  )
}
