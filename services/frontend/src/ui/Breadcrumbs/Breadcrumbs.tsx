import classNames from 'classnames/bind'
import React from 'react'
import { Link, matchPath, useMatches } from 'react-router-dom'
import BaseToolTip from '../../components/BaseToolTip/BaseToolTip'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'
import s from './Breadcrumbs.module.scss'

export const Breadcrumbs = () => {
  const matches = useMatches()
  const { options, dispatch } = useDisplay()
  const contextPath = options.get(consts.BREADCRUMBS_PATH)
  const match = contextPath?.location
    ? matchPath({ path: contextPath?.location || '' }, location.pathname)
    : null
  let cx = classNames.bind(s)

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
              <span
                key={i}
                className={cx('route', !match && 'active')}
              >
                {crumb?.handle as string}
              </span>
            )
          )
        })}
        {match &&
          contextPath?.path?.map((name: string, i: number) => (
            <React.Fragment key={name + i}>
              <span className={s.slash} />
              <span
                className={cx(
                  'route',
                  contextPath?.path?.length - 1 === i && 'active'
                )}
              >
                {name ?? '...'}
              </span>
            </React.Fragment>
          ))}
      </div>
    </>
  )
}
