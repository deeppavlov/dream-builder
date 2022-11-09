import { RadioButton } from './RadioButton'
import s from './Skill.module.scss'

export const Skill = ({ title }: any) => {
  return (
    <div className={s.skill}>
      <div className={s.left}>
        <RadioButton />
        <p>{title}</p>
      </div>
      <div className={s.arrow}></div>
    </div>
  )
}
