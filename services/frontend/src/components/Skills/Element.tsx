import SkillLogo from '../../assets/icons/Skillls.svg'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'

export const Element = ({}) => {
  return (
    <div className={s.element}>
      <div className={s.left}>
        <div className={s.top}>
          <img src={SkillLogo} className={s.icon} />
          <p className={s.name}>DFF Program Y</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>RAM:1.0 GB 0.0 GB | Ex.t:00ms </p>
        </div>
      </div>
      <div className={s.right}>
        <KebabButton />
        <ToggleButton />
      </div>
    </div>
  )
}
