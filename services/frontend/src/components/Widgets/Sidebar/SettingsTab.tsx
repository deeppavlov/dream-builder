import classNames from 'classnames/bind'
import { useAuth, useUIOptions } from 'context'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Gear } from 'assets/icons/gear.svg'
import { TOOLTIP_DELAY } from 'constants/constants'
import { useGaToken } from 'hooks/googleAnalytics/useGaToken'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { BaseToolTip } from 'components/Menus'
import s from './SettingsTab.module.scss'

export const SettingsTab = () => {
  const auth = useAuth()
  const isAuthorized = Boolean(auth?.user)
  const { UIOptions } = useUIOptions()
  const { t } = useTranslation('translation', { keyPrefix: 'sidebar.tooltips' })
  const isActive = UIOptions[consts.SETTINGS_MODAL_IS_ACTIVE]
  let cx = classNames.bind(s)
  const { setTokenState } = useGaToken()

  const settingsClickHandler = () => {
    if (!isAuthorized)
      return trigger('SignInModal', {
        requestModal: { name: 'ProfileSettingsModal' },
      })

    setTokenState('services_common_button')
    trigger('ProfileSettingsModal', {})
  }

  return (
    <button
      id='settingsTab'
      data-tooltip-id='sidebar_settings'
      onClick={settingsClickHandler}
      className={cx('settings', isActive && 'active')}
    >
      <Gear />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='sidebar_settings'
        content={t('settings')}
        place='right'
      />
    </button>
  )
}
