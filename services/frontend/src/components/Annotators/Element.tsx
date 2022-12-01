import SkillLogo from '../../assets/icons/skillIcon.svg'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'

export const Element = ({}) => {
  return (
    <div className={s.element}>
      <div className={s.left}>
        <div className={s.top}>
          <img className={s.icon} src={SkillLogo} />
          <p className={s.name}>Fact Retrieval</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>RAM:1.5Gb | GPU:0.0Gb </p>
        </div>
      </div>
      <div className={s.right}>
        <KebabButton />
        <ToggleButton />
      </div>
    </div>
  )
}
