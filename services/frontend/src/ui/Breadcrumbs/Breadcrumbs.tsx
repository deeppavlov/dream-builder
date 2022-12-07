import { Link } from 'react-router-dom'
import s from './Breadcrumbs.module.scss'

export const Breadcrumbs = () => {
  return (
    <>
      <div
        data-tip='Go to Home Page'
        data-for='topbar_tooltip'
        className={s.breadcrumbs}>
        <Link to='/'>
          <button className={s.home} />
        </Link>
      </div>
      <div className={s.routes}>
        <span className={s.slash}>/</span>
        <span>Breadcrumbs</span>
      </div>
    </>
  )
}
