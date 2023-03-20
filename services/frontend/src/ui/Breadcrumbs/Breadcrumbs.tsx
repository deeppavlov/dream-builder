import { FC } from 'react'
import { Link, useMatches } from 'react-router-dom'
import BaseToolTip from '../../components/BaseToolTip/BaseToolTip'
import s from './Breadcrumbs.module.scss'

interface Props {
  tab?: string
  path?: string[]
}

export const Breadcrumbs: FC<Props> = ({ path, tab }) => {
  const matches = useMatches()
  return (
    <>
      <div data-tip data-tooltip-id='home' className={s.breadcrumbs}>
        <Link to='/'>
          <button className={s.home} />
        </Link>
        <BaseToolTip id='home' content='Go to home page' />
      </div>

      <div className={s.routes}>
        {matches.at(-1)?.pathname !== '/' && <span className={s.slash} />}
        {matches.map((crumb, i) => {
          return (
            crumb.pathname !== '/' && (
              <span key={i}>{crumb?.handle as string}</span>
            )
          )
        })}
        {path?.map(name => (
          <>
            <span className={s.slash} />
            {name}
          </>
        ))}

        {tab && <span className={s.slash} />}
        {tab}
      </div>
    </>
  )
}
