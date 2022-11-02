import { KebabButton } from './KebabButton'
import s from './Element.module.scss'

export const Element = () => {
  return (
    <div className={s.element}>
      <div className={s.top}>
        <h5>SETitle</h5>
        <div className={s.btn_group}>
          <KebabButton />
          <button className={s.links_btn}></button>
          <button className={s.switch}></button>
        </div>
      </div>
      <p className={s.data}>1.5 Gb RAM | 0.0 Gb GPU</p>
    </div>
  )
}
