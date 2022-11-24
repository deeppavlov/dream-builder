import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'

export const Element = ({}) => {
  return (
    <div className={s.element}>
      <div className={s.left}>
        <div className={s.top}>
          <span className={s.icon}></span>
          <h6>dff program y</h6>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>1.0 GB 0.0 GB | St.t:00sec | Ex.t:00ms </p>
          <p className={s.date}>22.08.2022</p>
        </div>
      </div>
      <div className={s.right}>
        <KebabButton />
        <ToggleButton />
      </div>
    </div>
  )
}
