import { Element } from './components/Element'
import { KebabButton } from './components/KebabButton'
import s from './Annotators.module.scss'

export const Annotators = () => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <span className={s.icon} />
            <h5>Annotators</h5>
          </div>
          <KebabButton />
        </div>
        <div className={s.bottom}>
          <p className={s.data}>7.356 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <button className={s.add_btn}>
        <span className={s.icon} />
        <p>Add Annotators</p>
      </button>
      <Element />
      <Element />
      <Element />
      <Element />
      <Element />
    </div>
  )
}
