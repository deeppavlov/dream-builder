import classNames from 'classnames/bind'
import { useAuth, useUIOptions } from 'context'
import { useParams } from 'react-router-dom'
import { TTopbar } from 'types/types'
import { consts } from 'utils/consts'
import { GoogleSignInButton } from 'components/Buttons'
import { Profile } from 'components/Menus'
import { BurgerMenu } from 'components/Menus/BurgerMenu/BurgerMenu'
import s from './Topbar.module.scss'
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
  return (
    <div className={cx('topbar', isEditor && 'editor', !user && 'gapForBtns')}>
      <BurgerMenu type={type} dist={dist} />
      <div className={s.crumbs}>
        <Breadcrumbs />
      </div>
      <div className={s.btns}>
        {isTableViewSwitcher && <Display />}
        {isEditor && <Test />}
        {user ? <Profile auth={auth} /> : <GoogleSignInButton />}
      </div>
    </div>
  )
}
