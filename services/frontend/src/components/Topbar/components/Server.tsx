import { ReactComponent as Icon } from '../../../assets/icons/server.svg'
import s from './Server.module.scss'

export const Server = () => {
  return (
    <button className={s.server}>
      <Icon />
    </button>
  )
}
