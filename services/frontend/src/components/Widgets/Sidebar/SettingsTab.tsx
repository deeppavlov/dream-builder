import classNames from 'classnames/bind'
import { useDisplay } from 'context'
import { ReactComponent as Gear } from 'assets/icons/gear.svg'
import { TOOLTIP_DELAY } from 'constants/constants'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { BaseToolTip } from 'components/Menus'
import s from './SettingsTab.module.scss'

export const SettingsTab = () => {
  const { options } = useDisplay()
  const isActive = options.get(consts.SETTINGS_MODAL_IS_ACTIVE)
  let cx = classNames.bind(s)

  const settingsClickHandler = () => trigger('AccessTokensModal', {})

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
