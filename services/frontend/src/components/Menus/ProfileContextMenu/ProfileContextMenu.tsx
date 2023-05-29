import { logout } from 'context/AuthProvider'
import { trigger } from 'utils/events'
import { ContextMenuButton } from 'components/Buttons'
import { BaseContextMenu } from 'components/Menus'

interface Props {
  tooltipId: string
  userEmail: string
}

export const ProfileContextMenu = ({ tooltipId, userEmail }: Props) => {
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
        name='Log out'
        handleClick={logout}
      />
    </BaseContextMenu>
  )
}
