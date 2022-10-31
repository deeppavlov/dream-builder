import { Element } from './components/Element'
import { KebabButton } from '../Stack/components/KebabButton'

import s from './Stack.module.scss'

export const Stack = () => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.header_top}>
          <div className={s.title}>
            <span className={s.icon}>💬</span>
            <h5> Annotators</h5>
          </div>
          <KebabButton />
        </div>
        <p className={s.data}>7.356 Gb RAM | 0.0 Gb GPU</p>
      </div>
      <button className={s.add_btn}>+ Add Annotators</button>
      <Element />
      <Element />
      <Element />
      <Element />
      <Element />
    </div>
  )
}
