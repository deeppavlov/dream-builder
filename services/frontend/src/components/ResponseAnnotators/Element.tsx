import BadWordsLogo from '../../assets/icons/bad_words.svg'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'

export const Element = ({}) => {
  return (
    <div className={s.element}>
      <div className={s.left}>
        <div className={s.top}>
          <img src={BadWordsLogo} className={s.icon} />
          <p className={s.name}>Badlisted Words Detector</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>2.0 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <div className={s.right}>
        <KebabButton />
        <ToggleButton />
      </div>
    </div>
  )
}
