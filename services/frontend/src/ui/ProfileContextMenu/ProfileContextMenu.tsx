import { useNavigate } from 'react-router-dom'
import BaseContextMenu from '../../components/BaseContextMenu/BaseContextMenu'
import ContextMenuButton from '../../components/ContextMenuButton/ContextMenuButton'
import { logout } from '../../context/AuthProvider'
import { RoutesList } from '../../router/RoutesList'

interface Props {
  tooltipId: string
  userEmail: string
}

export const ProfileContextMenu = ({ tooltipId, userEmail }: Props) => {
  const nav = useNavigate()

  const handleProfileClick = () => nav(RoutesList.profile)
  return (
    <BaseContextMenu tooltipId={tooltipId} place='bottom'>
      <ContextMenuButton
        type='profile'
        theme='dark'
        name={userEmail}
        handleClick={handleProfileClick}
      />
      <hr />
      <ContextMenuButton type='logout' theme='dark' name='Log out' handleClick={logout} />
    </BaseContextMenu>
  )
}
