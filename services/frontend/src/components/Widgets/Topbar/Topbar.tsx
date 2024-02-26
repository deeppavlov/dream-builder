import classNames from 'classnames/bind'
import { useAuth, useUIOptions } from 'context'
import { useParams } from 'react-router-dom'
import { TTopbar } from 'types/types'
import { consts } from 'utils/consts'
import { SignInButton } from 'components/Buttons'
import { Profile } from 'components/Menus'
import { BurgerMenu } from 'components/Menus/BurgerMenu/BurgerMenu'
import s from './Topbar.module.scss'
import { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs'
import { Display } from './components/Display'
import { LanguageToggle } from './components/LanguageToggle'
import { Test } from './components/Test'

export const Topbar = () => {
  const auth = useAuth()
  const user = auth?.user
  const { name } = useParams()
  const { UIOptions } = useUIOptions()
  const type: TTopbar = name !== undefined ? 'editor' : 'main'
  const isEditor = type === 'editor'
  const cx = classNames.bind(s)
  const dist = UIOptions[consts.ACTIVE_ASSISTANT]
  return (
    <div className={cx('topbar', isEditor && 'editor', !user && 'gapForBtns')}>
      <BurgerMenu type={type} dist={dist} />
      <div className={s.container}>
        <div className={s.crumbs}>
          <Breadcrumbs />
        </div>
        <div className={s.topBarPanel}>
          {isEditor ? (
            <Test />
          ) : (
            <div className={s.btns}>
              <LanguageToggle />
              <Display />
            </div>
          )}
          {user ? <Profile auth={auth} /> : <SignInButton />}
        </div>
      </div>
    </div>
  )
}
