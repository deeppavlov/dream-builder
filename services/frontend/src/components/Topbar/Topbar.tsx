import classNames from 'classnames/bind'
import GoogleSignInButton from '../GoogleSignInButton/GoogleSignInButton'
import { useAuth } from '../../context/AuthProvider'
import { Breadcrumbs } from '../../ui/Breadcrumbs/Breadcrumbs'
import { Profile } from '../../ui/Profile/Profile'
import { Menu } from '../../ui/Menu/Menu'
import { Display } from './components/Display'
import { Test } from './components/Test'
import { trigger } from '../../utils/events'
import { CloneButton } from '../CloneButton/CloneButton'
import s from './Topbar.module.scss'

interface TopbarProps {
  type?: 'main' | 'editor' | 'dff'
  viewHandler?: () => void
  dialogHandler?: () => void
  children?: React.ReactNode
  innerRef?: React.LegacyRef<any>
  title?: string
  viewChanger?: boolean
  tab?: string
  name?: string
  dist?: BotInfoInterface
}

export const Topbar = ({
  type,
  viewHandler,
  dialogHandler,
  innerRef,
  title,
  viewChanger,
  tab,
  name,
  dist,
}: TopbarProps) => {
  const auth = useAuth()
  const user = auth?.user
  let cx = classNames.bind(s)

  const handleCloneBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!user) {
      trigger('SignInModal', {})
      return
    }
    trigger('AssistantModal', {
      action: 'clone',
      bot: { name: name, display_name: title },
    })
  }
  switch (type) {
    case 'main':
      return (
        <div className={s.topbar} ref={innerRef}>
          <Menu type='main' />
          <div className={s.logo_area}>
            <Breadcrumbs />
          </div>
          <div className={s.btns_area}>
            <Display viewHandler={viewHandler} />
            {user ? <Profile auth={auth} /> : <GoogleSignInButton />}
          </div>
        </div>
      )
    case 'editor':
      return (
        <>
          <div className={cx('topbar', 'editor')} ref={innerRef}>
            <Menu dist={dist} type='editor' />
            <div className={s.logo_area}>
              <Breadcrumbs tab={tab}>{title}</Breadcrumbs>
            </div>
            <CloneButton handler={handleCloneBtnClick} />
            <div className={s.btns_area}>
              {viewChanger && <Display viewHandler={viewHandler} />}
              <Test dist={ dist} dialogHandler={dialogHandler} />
              {user ? <Profile auth={auth} /> : <GoogleSignInButton />}
            </div>
          </div>
        </>
      )
    case 'dff':
      return <>DFF Topbar</>
  }

  return (
    <div className={s.topbar} ref={innerRef}>
      <Menu type='main' />
      <div className={s.logo_area}>
        <Breadcrumbs />
      </div>
      <div className={s.btns_area}>
        {user ? <Profile auth={auth} /> : <GoogleSignInButton />}
      </div>
    </div>
  )
}
