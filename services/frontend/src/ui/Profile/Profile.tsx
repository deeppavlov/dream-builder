import { ReactComponent as ArrowDown } from '@assets/icons/arrow_down_topbar.svg'
import { useAuth } from '../../context/AuthProvider'
import { ProfileContextMenu } from '../ProfileContextMenu/ProfileContextMenu'
import s from './Profile.module.scss'

export const Profile = () => {
  const auth = useAuth()
  const tooltipId = 'profile'
  return (
    <div className={s.avatar} data-tooltip-id={tooltipId}>
      <img
        src={auth?.user?.picture}
        referrerPolicy='no-referrer'
        className={s.avatar__picture}
      />
      <ArrowDown className={s.arrow} />

      <ProfileContextMenu
        tooltipId={tooltipId}
        userEmail={auth?.user?.email || 'Profile'}
      />
    </div>
  )
}
