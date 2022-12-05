import { ReactComponent as NotificationsLogo } from '../../../assets/icons/notifications.svg'
import s from './Notifications.module.scss'

export const Notifications = () => {
  return (
    <button className={s.notifications}>
      <NotificationsLogo />
    </button>
  )
}
