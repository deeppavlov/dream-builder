import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import SkillLogo from '../../assets/icons/book.svg'
import s from './Element.module.scss'

export const Element = ({}) => {
  return (
    <div className={s.element}>
      <div className={s.left}>
        <div className={s.top}>
          <img src={SkillLogo} className={s.icon}></img>
          <p className={s.name}>Fact Retrieval</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>1.5 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <div className={s.right}>
        <KebabButton />
        <ToggleButton />
      </div>
    </div>
  )
}
