import { useAuth } from 'context'
import { FC } from 'react'
import { ReactComponent as ArrowDown } from 'assets/icons/arrow_down_topbar.svg'
import { ProfileContextMenu } from 'components/Menus'
import s from './Profile.module.scss'

interface Props {
  auth: any
}

export const Profile: FC<Props> = () => {
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
