import { Link } from 'react-router-dom'
import s from './Breadcrumbs.module.scss'

export const Breadcrumbs = () => {
  return (
    <div className={s.breadcrumbs}>
      <Link to='/start'>
        <button className={s.home} />
      </Link>
      <div className={s.routes} />
    </div>
  )
}
