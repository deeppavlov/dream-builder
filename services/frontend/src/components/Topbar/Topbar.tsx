import jwtDecode from 'jwt-decode'
import ReactTooltip from 'react-tooltip'
import { useEffect } from 'react'
import { BurgerButton } from '../../ui/BurgerButton/BurgerButton'
import { Breadcrumbs } from '../../ui/Breadcrumbs/Breadcrumbs'
import { Profile } from '../../ui/Profile/Profile'
import { Display } from './components/Display'
import { History } from './components/History'
import { Test } from './components/Test'
import { Resources } from './components/Resources'
import { Menu } from '../../ui/Menu/Menu'
import { Notifications } from './components/Notifications'
import s from './Topbar.module.scss'

export const Topbar = ({ children, type, viewHandler }: any) => {
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
            <Profile />
          </div>
          <ReactTooltip
            id='topbar_tooltip'
            place='bottom'
            effect='solid'
            className={s.tooltips}
            offset={{ right: 44, top: -5 }}
            delayShow={500}
          />
        </div>
      )
    case 'editor':
      return (
        <>
          <div className={s.topbar}>
            <Menu type='editor' />
            <div className={s.logo_area}>
              <Breadcrumbs />
            </div>
            <div className={s.btns_area}>
              <History />
              <Resources />
              <Notifications />
              <Test />
              <Profile />
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
        <Profile />
      </div>
    </div>
  )
}
