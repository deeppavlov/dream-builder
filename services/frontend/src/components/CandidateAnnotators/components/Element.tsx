import { KebabButton } from '../../Annotators/components/KebabButton'
import { SliderButton } from '../../Annotators/components/SliderButton'
import s from './Element.module.scss'

export const Element = ({}) => {
  return (
    <div className={s.element}>
      <div className={s.left}>
        <div className={s.top}>
          <span className={s.icon}></span>
          <h6>Badlisted Words Detector</h6>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>2.0 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <div className={s.right}>
        <KebabButton />
        <SliderButton />
      </div>
    </div>
  )
}
