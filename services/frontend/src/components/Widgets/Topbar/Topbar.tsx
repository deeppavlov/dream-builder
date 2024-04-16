import classNames from 'classnames/bind'
import { useAuth, useUIOptions } from 'context'
import { useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { TTopbar } from 'types/types'
import { consts } from 'utils/consts'
import { SignInButton } from 'components/Buttons'
import { Profile } from 'components/Menus'
import { BurgerMenu } from 'components/Menus/BurgerMenu/BurgerMenu'
import s from './Topbar.module.scss'
import { AdminPanelBtn } from './components/AdminPanelBtn'
import { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs'
import { Display } from './components/Display'
import { Test } from './components/Test'

export const Topbar = () => {
  const auth = useAuth()
  const user = auth?.user
  const { name } = useParams()
  const { UIOptions } = useUIOptions()
  const type: TTopbar = name !== undefined ? 'editor' : 'main'
  const isEditor = type === 'editor'
  const editorActiveTab = UIOptions[consts.EDITOR_ACTIVE_TAB]
  const skillEditorIsActive = UIOptions[consts.EDITOR_ACTIVE_SKILL]
  const isTableViewSwitcher = isEditor
    ? editorActiveTab == 'Architecture' && !skillEditorIsActive
    : location.pathname !== '/profile'
  const cx = classNames.bind(s)
  const dist = UIOptions[consts.ACTIVE_ASSISTANT]
  const isAdminPanel =
    location.pathname === '/admin' ||
    location.pathname === '/admin/requests' ||
    location.pathname === '/admin/users'

  const isAdminPanelAccessible = user?.role.id === 2 || user?.role.id === 3
  return (
    <div className={cx('topbar', isEditor && 'editor', !user && 'gapForBtns')}>
      <BurgerMenu type={type} dist={dist} />
      <div className={s.container}>
        <div className={s.crumbs}>
          <Breadcrumbs />
        </div>
        <div className={s.rightSide}>
          <div className={s.btns}>
            {isAdminPanelAccessible && <AdminPanelBtn />}
            {isTableViewSwitcher && !isAdminPanel && <Display />}
            {isEditor && <Test />}
          </div>
          {user ? <Profile auth={auth} /> : <SignInButton />}
        </div>
      </div>
    </div>
  )
}
