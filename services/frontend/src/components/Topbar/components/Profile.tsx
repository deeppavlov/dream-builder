import ReactTooltip from 'react-tooltip'

import Avatar from '../../../assets/images/avatar.png'
// import Logo from '../../../assets/images/yva.png'

import { ReactComponent as You } from '../../../assets/icons/team.svg'
import { ReactComponent as Your } from '../../../assets/icons/bot.svg'
import { ReactComponent as Settings } from '../../../assets/icons/faders.svg'
import { ReactComponent as LogOut } from '../../../assets/icons/log_out.svg'
import { ReactComponent as ArrowDown } from '../../../assets/icons/arrow_down_topbar.svg'

import { useTooltip } from '../../../hooks/useTooltip'
import s from './Profile.module.scss'

export const Profile = () => {
  useTooltip()
  return (
    <button className={s.avatar} data-tip data-for='menu'>
      <ReactTooltip
        globalEventOff='click'
        arrowColor='#8d96b5'
        clickable={true}
        event='click'
        className='tooltip_menu'
        offset={{ left: 90, top: -13 }}
        type='dark'
        id='menu'
        place='bottom'
        effect='solid'>
        <ul className={s.menu}>
          <li className={s.item}>
            <You />
            <p>irinanikitenkole@gmail.com</p>
          </li>
          {/* <li className={s.item}>
            <Your />
            <p>Your Virtual Assistants</p>
          </li>
          <li className={s.item}>
            <Settings />
            <p>Settings</p>
          </li> */}
          <li className={s.item}>
            <LogOut />
            <p>Log Out</p>
          </li>
        </ul>
      </ReactTooltip>
      <img src={Avatar} />
      <ArrowDown className={s.arrow} />
    </button>
  )
}
