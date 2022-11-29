import jwtDecode from 'jwt-decode'
import ReactTooltip from 'react-tooltip'
import { useEffect } from 'react'
import { BurgerButton } from '../../ui/BurgerButton/BurgerButton'
import { Breadcrumbs } from '../../ui/Breadcrumbs/Breadcrumbs'
import { Profile } from '../../ui/Profile/Profile'
import { Display } from './components/Display'
import { History } from './components/History'
import { Test } from './components/Test'
import { Server } from './components/Server'
import s from './Topbar.module.scss'
import { Menu } from '../../ui/Menu/Menu'

export const Topbar = ({ children, type, viewHandler }: any) => {
  const handleCallbackResponse = response => {
    console.log('JWT = ' + JSON.stringify(response.credential))
    console.log(jwtDecode(JSON.stringify(response.credential)))
  }
  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        '207081743698-inmfpn8fnrqntj4em2298tc5vdf4gptm.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    })
    google.accounts.id.renderButton(document.getElementById('signin'), {
      type: 'standart',
      theme: 'filled_black',
      size: 'large',
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
            <Profile />
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
            {/* <div id='signin' className={s.signin}></div> */}
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
              <Server />
              <Test />
              <Profile />
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
        <Profile />
      </div>
    </div>
  )
}
