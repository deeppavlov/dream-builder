import { Link } from 'react-router-dom'
import { TopbarMenu } from '../Topbar/components/Menu'
import { SignInButton } from '../Topbar/components/SignInButton'
import { SignUpButton } from '../Topbar/components/SignUpButton'
import { Breadcrumbs } from './components/Breadcrumbs'
import { Search } from './components/Search'
import { Categories } from './components/Categories'
import { Filter } from './components/Filter'
import { Display } from './components/Display'
import s from './Topbar.module.scss'
import { Profile } from './components/Profile'

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
          <div className={s.btns_area}>
            <Display />
            <Profile />
          </div>
        </div>
      )
    case 'dff':
      return <>DFF Topbar</>
  }
  return (
    <div className={s.topbar}>
      <TopbarMenu />
      <div className={s.logo_area}>
        <Link to='/'>
          <button className={s.logo}></button>
        </Link>
        <h3>Welcome&nbsp;to&nbsp;Dream&nbsp;Builder</h3>
      </div>
      <div className={s.btns_area}>
        <SignInButton />
        <SignUpButton />
      </div>
    </div>
  )
}
