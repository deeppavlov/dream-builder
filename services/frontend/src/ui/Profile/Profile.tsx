import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as You } from '@assets/icons/team.svg'
import { ReactComponent as LogOut } from '@assets/icons/log_out.svg'
import { ReactComponent as ArrowDown } from '@assets/icons/arrow_down_topbar.svg'
import { logout } from '../../context/AuthProvider'
import { UserContext } from '../../types/types'
import s from './Profile.module.scss'

interface ProfileProps {
  auth: UserContext
}
/**
 * `TooltipMenu` nedeed for correct render component in `RectTooltip`.
 * Currently for working LogOut button
 */
const TooltipMenu = ({ auth }: ProfileProps) => {
  const navigate = useNavigate()
  const clickHandler = () => {
    navigate('/profile')
  }
  return (
    <ul className={s.menu}>
      <li onClick={clickHandler} className={s.item}>
        <You />
        <p>{auth?.user?.email}</p>
      </li>
      <li onClick={logout} className={s.item}>
        <LogOut />
        <p>Log Out</p>
      </li>
    </ul>
  )
}

export const Profile = ({ auth }: ProfileProps) => {
  return (
    <div className={s.avatar} data-tip data-tooltip-id='menu'>
      <img
        src={auth?.user?.picture}
        referrerPolicy='no-referrer'
        className={s.avatar__picture}
      />
      <ArrowDown className={s.arrow} />
      <ReactTooltip
        className={s.profile_menu}
        classNameArrow={s.tooltipArrow}
        id='menu'
        clickable
        events={['click']}
        place='bottom'>
        <TooltipMenu auth={auth} />
      </ReactTooltip>
    </div>
  )
}
