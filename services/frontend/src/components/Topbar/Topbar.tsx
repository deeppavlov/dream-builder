import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames/bind'
import { Breadcrumbs } from '../../ui/Breadcrumbs/Breadcrumbs'
import { Profile } from '../../ui/Profile/Profile'
import { Menu } from '../../ui/Menu/Menu'
import { useAuth } from '../../services/AuthProvider'
import { Notifications } from './components/Notifications'
import { Display } from './components/Display'
import { History } from './components/History'
import { Test } from './components/Test'
import { Resources } from './components/Resources'
import s from './Topbar.module.scss'

interface TopbarProps {
  type?: 'main' | 'editor' | 'dff'
  viewHandler?: () => void
  children?: React.ReactNode
  innerRef?: React.LegacyRef<any>
}

export const Topbar = ({ type, viewHandler, innerRef }: TopbarProps) => {
  const auth = useAuth()
  const user = auth?.user
  let cx = classNames.bind(s)
  useEffect(() => {
    //Render Google SignIn button
    // google.accounts.id.initialize({
    //   // Getting `GOOGLE_CLIENT_ID` from .env file
    //   // Maybe need to get `GOOGLE_CLIENT_ID` from backend
    //   client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    //   callback: auth?.login,
    // })
    // google.accounts.id.renderButton(document.getElementById('signin')!, {
    //   type: 'standard',
    //   size: 'medium',
    //   text: 'signin',
    // })
  }, [])

  const SignInBtn = () => (
    <div className={s.signin} onClick={auth?.login}>
      Sign in
    </div>
  )

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
            {user ? <Profile auth={auth} /> : <SignInBtn />}
          </div>
          <ReactTooltip
            id='topbar_tooltip'
            place='bottom'
            effect='solid'
            className={s.tooltips}
            delayShow={500}
          />
        </div>
      )
    case 'editor':
      return (
        <>
          <div className={cx('topbar', 'editor')} ref={innerRef}>
            <Menu type='editor' />
            <div className={s.logo_area}>
              <Breadcrumbs />
            </div>
            <div className={s.btns_area}>
              <History />
              <Resources />
              <Notifications />
              <Test />
              {user ? <Profile auth={auth} /> : <SignInBtn />}
            </div>
          </div>
          <ReactTooltip
            id='topbar_tooltip'
            place='bottom'
            effect='solid'
            className={s.tooltips}
            delayShow={500}
          />
        </>
      )
    case 'dff':
      return <>DFF Topbar</>
  }

  return (
    <div className={s.topbar} ref={innerRef}>
      <Menu type='main' />
      <div className={s.logo_area}>
        <span className={s.logo} />
        <h3>Dream&nbsp;Builder</h3>
      </div>
      <div className={s.btns_area}>
        {user ? <Profile auth={auth} /> : <SignInBtn />}
      </div>
    </div>
  )
}
