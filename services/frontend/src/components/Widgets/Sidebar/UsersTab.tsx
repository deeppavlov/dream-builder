import classNames from 'classnames/bind'
import { useAuth } from 'context'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { TOOLTIP_DELAY } from 'constants/constants'
import { SvgIcon } from 'components/Helpers'
import { BaseToolTip } from 'components/Menus'
import s from './UsersTab.module.scss'

interface Props {
  isActive?: boolean
}

export const UsersTab = ({ isActive }: Props) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  let cx = classNames.bind(s)

  const { user } = useAuth()
  const isAdmin = user?.role.id === 3
  if (!isAdmin) return null

  const integrationClickHandler = () => {
    navigate(RoutesList.admin.users)
  }
  return (
    <button
      onClick={integrationClickHandler}
      data-tooltip-id='sidebarUsersTab'
      className={cx('users', isActive && 'active')}
    >
      <SvgIcon iconName='users' />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='sidebarUsersTab'
        content={t('sidebar.tooltips.users')}
        place='right'
      />
    </button>
  )
}
