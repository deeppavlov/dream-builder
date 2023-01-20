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
import ResourcesSidePanel from '../ResourcesSidePanel/ResourcesSidePanel'

interface TopbarProps {
  type?: 'main' | 'editor' | 'dff'
  viewHandler?: () => void
  children?: React.ReactNode
  innerRef?: React.LegacyRef<any>
  title?: string
}

export const Topbar = ({ type, viewHandler, innerRef, title }: TopbarProps) => {
  const auth = useAuth()
  let cx = classNames.bind(s)
  useEffect(() => {
    //Render Google SignIn button
    google.accounts.id.initialize({
      /**
       * Getting `VITE_GOOGLE_CLIENT_ID` from .env file.
       * Maybe need to get `GOOGLE_CLIENT_ID` from backend
       */
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
        <div className={s.topbar} ref={innerRef}>
          <Menu type='main' />
          <div className={s.logo_area}>
            <Breadcrumbs />
          </div>
          <div className={s.btns_area}>
            <Display viewHandler={viewHandler} />
            {auth?.user ? (
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
          <ResourcesSidePanel position={{ top: 64 }} />
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
            {title}
            <div className={s.btns_area}>
              {/* <History /> */}
              <Resources />
              {/* <Notifications /> */}
              <Test />
              {auth?.user ? (
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
          <ResourcesSidePanel position={{ top: 64 }} />
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
        {auth?.user ? (
          <Profile auth={auth} />
        ) : (
          <div id='signin' className={s.signin}></div>
        )}
      </div>
      <ResourcesSidePanel position={{ top: 64 }} />
    </div>
  )
}
