import { ReactComponent as NotificationsLogo } from '../../../assets/icons/notifications.svg'
import s from './Notifications.module.scss'

export const Notifications = () => {
  return (
    <button
      data-for='topbar_tooltip'
      data-tip='Notifications'
      className={s.notifications}>
      <NotificationsLogo />
    </button>
  )
}
