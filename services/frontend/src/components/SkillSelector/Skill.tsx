import { Kebab } from '../../ui/Kebab/Kebab'
import s from './Skill.module.scss'

export const Skill = ({ title }: any) => {
  return (
    <div className={s.skill}>
      <div className={s.left}>
        <p className={s.name}>{title}</p>
      </div>
      <div className={s.arrow}>
        <Kebab dataFor='skill_selector' />
      </div>
    </div>
  )
}
