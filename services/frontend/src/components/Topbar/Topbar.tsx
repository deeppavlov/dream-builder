import ReactTooltip from 'react-tooltip'
import { useEffect, useState } from 'react'
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
          <Menu />
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
            arrowColor='#8d96b5'
            offset={{ right: 44, top: -5 }}
            delayShow={1000}
          />
        </div>
      )
    case 'home':
      return (
        <div className={s.topbar}>
          <div className={s.logo_area}>
            <span className={s.logo}></span>
            <h3>Dream&nbsp;Builder</h3>
          </div>
          <div className={s.btns_area}>
            <button className={s.watch}>Watch Demo</button>
            <a href='https://github.com/deeppavlov/dream'>
              <button data-tip='Open Source on GitHub' className={s.github} />
            </a>
          </div>
          <ReactTooltip
            place='bottom'
            effect='solid'
            className={s.tooltips}
            arrowColor='#8d96b5'
            offset={{ right: 55, top: -5 }}
            delayShow={1000}
          />
        </div>
      )
    case 'editor':
      return (
        <>
          <div className={s.topbar}>
            <Menu />
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
        </>
      )
    case 'dff':
      return <>DFF Topbar</>
  }

  return (
    <div className={s.topbar}>
      <Menu />
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
