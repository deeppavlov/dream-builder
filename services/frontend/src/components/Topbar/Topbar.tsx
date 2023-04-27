import classNames from 'classnames/bind'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { useDisplay } from '../../context/DisplayContext'
import { TTopbar } from '../../types/types'
import { Breadcrumbs } from '../../ui/Breadcrumbs/Breadcrumbs'
import { BurgerMenu } from '../../ui/BurgerMenu/BurgerMenu'
import { Profile } from '../../ui/Profile/Profile'
import { consts } from '../../utils/consts'
import { AssistantCloneButton } from '../AssistantCloneButton/AssistantCloneButton'
import GoogleSignInButton from '../GoogleSignInButton/GoogleSignInButton'
import { Display } from './components/Display'
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
  const skillEditorIsActive = options.get(consts.EDITOR_ACTIVE_SKILL)
  const isTableViewSwitcher = isEditor
    ? editorActiveTab !== 'Architecture' && !skillEditorIsActive
    : location.pathname !== '/profile'
  let cx = classNames.bind(s)

  return (
    <div className={cx('topbar', isEditor && 'editor')}>
      <BurgerMenu type={type} dist={options.get(consts.ACTIVE_ASSISTANT)} />
      <div className={s.logo_area}>
        <Breadcrumbs />
      </div>
      {isEditor && <AssistantCloneButton />}
      <div className={s.btns_area}>
        {isTableViewSwitcher && <Display />}
        {isEditor && <Test />}
        {user ? <Profile auth={auth} /> : <GoogleSignInButton />}
      </div>
    </div>
  )
}
