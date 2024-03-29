import { useTranslation } from 'react-i18next'
import { logout } from 'api/user'
import { useGaAuth } from 'hooks/googleAnalytics/useGaAuth'
import { useGaToken } from 'hooks/googleAnalytics/useGaToken'
import { trigger } from 'utils/events'
import { ContextMenuButton } from 'components/Buttons'
import { BaseContextMenu } from 'components/Menus'

interface Props {
  tooltipId: string
  userEmail: string
}

export const logoutBtnId = 'logout'

export const ProfileContextMenu = ({ tooltipId, userEmail }: Props) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'topbar.ctx_menus.profile',
  })
  const { setTokenState } = useGaToken()
  const { userLoggedOut } = useGaAuth()

  const handleProfileClick = () => {
    setTokenState('profile_settings')
    trigger('ProfileSettingsModal', {})
  }

  const logoutClick = () => {
    userLoggedOut()
    logout()
  }

  return (
    <BaseContextMenu tooltipId={tooltipId} place='bottom'>
      <ContextMenuButton
        type='profile'
        theme='dark'
        name={t('settings')}
        handleClick={handleProfileClick}
      />
      <hr />
      <ContextMenuButton
        id={logoutBtnId}
        type='logout'
        theme='dark'
        name={t('log_out')}
        handleClick={logoutClick}
      />
    </BaseContextMenu>
  )
}
