import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
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

interface TopbarProps extends React.PropsWithChildren {
  type?: 'main' | 'editor' | 'dff'
  viewHandler?: void
}

export const Topbar = ({ type, viewHandler }: any) => {
  const auth = useAuth()
  const user = auth?.user

  useEffect(() => {
    //Render Google SignIn button
    google.accounts.id.initialize({
      // Getting `GOOGLE_CLIENT_ID` from .env file
      // Maybe need to get `GOOGLE_CLIENT_ID` from backend
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: auth?.login,
    })
    google.accounts.id.renderButton(document.getElementById('signin')!, {
      type: 'standard',
      size: 'medium',
      text: 'signin',
    })
  }, [])

  switch (type) {
    case 'main':
      return (
        <div className={s.topbar}>
          <Menu type='main' />
          <div className={s.logo_area}>
            <Breadcrumbs />
          </div>
          <div className={s.btns_area}>
            <Display viewHandler={viewHandler} />
            {user ? (
              <Profile auth={auth} />
            ) : (
              <div id='signin' className={s.signin}></div>
            )}
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
          <div
            style={{ boxShadow: '78px 0px 20px rgba(100, 99, 99, 0.15)' }}
            className={s.topbar}>
            <Menu type='editor' />
            <div className={s.logo_area}>
              <Breadcrumbs />
            </div>
            <div className={s.btns_area}>
              <History />
              <Resources />
              <Notifications />
              <Test />
              {user ? (
                <Profile auth={auth} />
              ) : (
                <div id='signin' className={s.signin}></div>
              )}
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
    <div className={s.topbar}>
      <Menu type='main' />
      <div className={s.logo_area}>
        <span className={s.logo} />
        <h3>Dream&nbsp;Builder</h3>
      </div>
      <div className={s.btns_area}>
        {user ? (
          <Profile auth={auth} />
        ) : (
          <div id='signin' className={s.signin}></div>
        )}
      </div>
    </div>
  )
}
