import classNames from 'classnames/bind'
import { ReactComponent as Gear } from '../../../assets/icons/gear.svg'
import { TOOLTIP_DELAY } from '../../../constants/constants'
import { useAuth } from '../../../context/AuthProvider'
import { useUIOptions } from '../../../context/UIOptionsContext'
import { consts } from '../../../utils/consts'
import { trigger } from '../../../utils/events'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import s from './SettingsTab.module.scss'

export const SettingsTab = () => {
  const auth = useAuth()
  const isAuthorized = Boolean(auth?.user)
  const { UIOptions } = useUIOptions()
  const isActive = UIOptions[consts.SETTINGS_MODAL_IS_ACTIVE]
  let cx = classNames.bind(s)

  const settingsClickHandler = () => {
    if (!isAuthorized)
      return trigger('SignInModal', {
        requestModal: { name: 'AccessTokensModal' },
      })

    trigger('AccessTokensModal', {})
  }

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
