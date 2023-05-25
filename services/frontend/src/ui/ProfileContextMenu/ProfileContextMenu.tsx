import { useTranslation } from 'react-i18next'
import BaseContextMenu from '../../components/BaseContextMenu/BaseContextMenu'
import ContextMenuButton from '../../components/ContextMenuButton/ContextMenuButton'
import { logout } from '../../context/AuthProvider'
import { trigger } from '../../utils/events'

interface Props {
  tooltipId: string
  userEmail: string
}

export const ProfileContextMenu = ({ tooltipId, userEmail }: Props) => {
const { t } = useTranslation()
  const handleProfileClick = () => trigger('AccessTokensModal', {})

  return (
    <BaseContextMenu tooltipId={tooltipId} place='bottom'>
      <ContextMenuButton
        type='profile'
        theme='dark'
        name={userEmail}
        handleClick={handleProfileClick}
      />
      <hr />
      <ContextMenuButton
        type='logout'
        theme='dark'
        name={t('menus.profile.log_out')}
        handleClick={logout}
      />
    </BaseContextMenu>
  )
}
