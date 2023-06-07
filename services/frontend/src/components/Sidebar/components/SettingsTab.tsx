import classNames from 'classnames/bind'
import { matchPath, useNavigate } from 'react-router-dom'
import { ReactComponent as Gear } from '../../../assets/icons/gear.svg'
import { TOOLTIP_DELAY } from '../../../constants/constants'
import { RoutesList } from '../../../router/RoutesList'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import s from './SettingsTab.module.scss'

export const SettingsTab = () => {
  const isActive = matchPath(RoutesList.profile, location.pathname)
  let cx = classNames.bind(s)

  const navigate = useNavigate()

  const settingsClickHandler = () => navigate('/profile')

  return (
    <button
      data-tooltip-id='sidebar_settings'
      onClick={settingsClickHandler}
      className={cx('settings', isActive && 'active')}
    >
      <Gear />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='sidebar_settings'
        content='Settings'
        place='right'
      />
    </button>
  )
}
