import { ReactComponent as Icon } from '../../../assets/icons/params.svg'
import s from './Resources.module.scss'

export const Resources = () => {
  return (
    <button
    data-tip='Storage'
    data-for='topbar_tooltip'
      className={s.resources}>
      <Icon />
    </button>
  )
}
