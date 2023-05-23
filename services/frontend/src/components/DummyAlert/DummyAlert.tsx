import SvgIcon from '../SvgIcon/SvgIcon'
import s from './DummyAlert.module.scss'

export const DummyAlert = () => {
  return (
    <div className={s.dummyContainer}>
      <div className={s.dummy}>
        <span className={s.line} />
        <div className={s.message}>
          <div className={s.circle}>
            <SvgIcon iconName='attention' />
          </div>
          <p>
            Something went wrong.
            <br />
            Restart the system.
          </p>
        </div>
        <span className={s.line} />
      </div>
    </div>
  )
}