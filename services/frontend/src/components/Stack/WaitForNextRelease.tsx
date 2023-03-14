import { ReactComponent as Clock } from '../../assets/icons/clock.svg'
import s from './WaitForNextRelease.module.scss'

export const WaitForNextRelease = () => {
  return (
    <div className={s.element}>
      <Clock />
      <p>Wait For Next Release</p>
    </div>
  )
}
