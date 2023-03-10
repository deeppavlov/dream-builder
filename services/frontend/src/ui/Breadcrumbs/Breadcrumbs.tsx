import { FC } from 'react'
import { Link, useMatches } from 'react-router-dom'
import s from './Breadcrumbs.module.scss'

interface Props {
  tab?: 'Architecture' | 'Skills'
  children?: React.ReactNode
}

export const Breadcrumbs: FC<Props> = ({ children, tab }) => {
  const matches = useMatches()
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
        {matches.at(-1)?.pathname !== '/' && <span className={s.slash} />}
        {matches.map(crumb => {
          return crumb.pathname !== '/' && crumb?.handle
        })}
        {children && <span className={s.slash} />}
        {children}
        {tab && <span className={s.slash} />}
        {tab}
      </div>
    </>
  )
}
