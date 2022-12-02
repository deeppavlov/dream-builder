import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import s from './Skill.module.scss'

export const Skill = ({ title }: any) => {
  return (
    <div className={s.skill}>
      <div className={s.left}>
     <RadioButton/>
        <p className={s.name}>{title}</p>
      </div>
      <div className={s.right}>
        <KebabButton />
      </div>
    </div>
  )
}
