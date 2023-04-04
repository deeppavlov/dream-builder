import { useParams } from 'react-router-dom'
import classNames from 'classnames/bind'
import GoogleSignInButton from '../GoogleSignInButton/GoogleSignInButton'
import { useAuth } from '../../context/AuthProvider'
import { Breadcrumbs } from '../../ui/Breadcrumbs/Breadcrumbs'
import { Profile } from '../../ui/Profile/Profile'
import { BurgerMenu } from '../../ui/BurgerMenu/BurgerMenu'
import { Display } from './components/Display'
import { AssistantCloneButton } from '../AssistantCloneButton/AssistantCloneButton'
import { TTopbar } from '../../types/types'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'
import { Test } from './components/Test'
import s from './Topbar.module.scss'

export const Topbar = () => {
  const auth = useAuth()
  const user = auth?.user
  const { name } = useParams()
  const { options } = useDisplay()
  const type: TTopbar = name !== undefined ? 'editor' : 'main'
  const isEditor = type === 'editor'
  const editorActiveTab = options.get(consts.EDITOR_ACTIVE_TAB)
  const isTableViewSwitcher = isEditor
    ? editorActiveTab !== 'Architecture'
    : location.pathname !== '/profile'
  let cx = classNames.bind(s)

  return (
    <div className={cx('topbar', isEditor && 'editor')}>
      <BurgerMenu type={type} />
      <Breadcrumbs />
      {isEditor && <AssistantCloneButton />}
      <div className={s.btns_area}>
        {isTableViewSwitcher && <Display />}
        {isEditor && <Test />}
        {user ? <Profile auth={auth} /> : <GoogleSignInButton />}
      </div>
    </div>
  )
}
