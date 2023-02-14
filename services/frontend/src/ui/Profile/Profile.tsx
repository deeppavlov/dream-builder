import ReactTooltip from 'react-tooltip'
import { ReactComponent as You } from '@assets/icons/team.svg'
import { ReactComponent as LogOut } from '@assets/icons/log_out.svg'
import { ReactComponent as ArrowDown } from '@assets/icons/arrow_down_topbar.svg'
import { logout } from '../../Router/AuthProvider'
import { UserContext } from '../../types/types'
import s from './Profile.module.scss'

interface ProfileProps {
  auth: UserContext
}

/**
 * `TooltipMenu` nedeed for correct render component in `RectTooltip`.
 * Currently for working LogOut button
 */
const TooltipMenu = ({ auth }: ProfileProps) => (
  <ul className={s.menu}>
    <li className={s.item}>
      <You />
      <p>{auth?.user?.email}</p>
    </li>
    <li onClick={logout} className={s.item}>
      <LogOut />
      <p>Log Out</p>
    </li>
  </ul>
)

export const Profile = ({ auth }: ProfileProps) => {
  return (
    <>
      <div className={s.avatar} data-tip data-for='menu'>
        <img
          src={auth?.user?.picture}
          referrerPolicy='no-referrer'
          className={s.avatar__picture}
        />
        <ArrowDown className={s.arrow} />
      </div>
      <ReactTooltip
        globalEventOff='click'
        arrowColor='#8d96b5'
        clickable={true}
        event='click'
        className={s.profile_menu}
        offset={{ left: 90, top: -13 }}
        id='menu'
        place='bottom'
        effect='solid'>
        <TooltipMenu auth={auth} />
      </ReactTooltip>
    </>
  )
}
