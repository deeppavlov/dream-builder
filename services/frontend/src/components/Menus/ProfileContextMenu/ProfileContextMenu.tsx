import { useTranslation } from 'react-i18next'
import { logout } from 'api/user'
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

  const handleProfileClick = () => trigger('ProfileSettingsModal', {})

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
        handleClick={logout}
      />
    </BaseContextMenu>
  )
}
