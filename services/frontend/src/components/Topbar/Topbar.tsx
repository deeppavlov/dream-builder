import { Link } from 'react-router-dom'
import { TopbarMenu } from '../Topbar/components/Menu'
import { Breadcrumbs } from './components/Breadcrumbs'
import { Search } from './components/Search'
import { Categories } from './components/Categories'
import { Filter } from './components/Filter'
import { Display } from './components/Display'
import { Profile } from './components/Profile'
import { History } from './components/History'
import { Test } from './components/Test'
import { Server } from './components/Server'
import s from './Topbar.module.scss'

export const Topbar = ({ children, type }: any) => {
  switch (type) {
    case 'main':
      return (
        <div className={s.topbar}>
          <TopbarMenu />
          <div className={s.logo_area}>
            <Breadcrumbs />
          </div>
          <div className={s.another_area}>
            <Search />
            <Categories />
            <Filter />
          </div>
          <div className={s.yet_another_area} />
          <div className={s.btns_area}>
            <Display />
            <Profile />
          </div>
        </div>
      )
    case 'dff':
      return <>DFF Topbar</>
    case 'home':
      return (
        <div className={s.topbar}>
          <div className={s.logo_area}>
            <span className={s.logo}></span>
            <h3>Dream&nbsp;Builder</h3>
          </div>
          <div className={s.btns_area}>
            <button className={s.watch}>Watch Demo</button>
            <button data-tip='Open Source on GitHub' className={s.github} />
            <button className={s.sign}>Sign&nbsp;In</button>
            <button className={s.sign}>Sign&nbsp;Up</button>
          </div>
        </div>
      )
    case 'editor':
      return (
        <>
          <div className={s.topbar}>
            <TopbarMenu />
            <div className={s.logo_area}>
              <Breadcrumbs />
            </div>
            <div className={s.another_area}>
              <Search />
              <Categories />
              <Filter />
            </div>
            <div className={s.yet_another_area} />
            <div className={s.btns_area}>
              <History />
              <Server />
              <Test />
              <Profile />
            </div>
          </div>
        </>
      )
  }

  return (
    <div className={s.topbar}>
      <TopbarMenu />
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
