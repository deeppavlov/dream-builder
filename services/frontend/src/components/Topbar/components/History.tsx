import s from './History.module.scss'
import { ReactComponent as Icon } from '../../../assets/icons/history.svg'
export const History = () => {
  return (
    <button className={s.history}>
      <Icon />
    </button>
  )
}
