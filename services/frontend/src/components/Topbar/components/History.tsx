import s from './History.module.scss'
import { ReactComponent as Icon } from '../../../assets/icons/history.svg'
export const History = () => {
  return (
    <button
      data-tip='Check Your History'
      data-for='topbar_tooltip'
      className={s.history}>
      <Icon />
    </button>
  )
}
