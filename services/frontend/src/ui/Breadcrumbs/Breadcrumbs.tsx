import { ReactComponent as HomeIcon } from '@assets/icons/home.svg'
import classNames from 'classnames/bind'
import React from 'react'
import { useMatches } from 'react-router-dom'
import BaseToolTip from '../../components/BaseToolTip/BaseToolTip'
import TopbarButton from '../../components/TopbarButton/TopbarButton'
import { useDisplay } from '../../context/DisplayContext'
import s from './Breadcrumbs.module.scss'

interface IHandle {
  crumb?: (routingName: string, options?: any) => any[]
}

export const Breadcrumbs = () => {
  const matches = useMatches()
  const { options } = useDisplay()
  let crumbs = matches
    // Filter routes with crumbs
    .filter(match => Boolean((match.handle as IHandle)?.crumb))
    // Setting data to route crumbs
    .map(({ handle, data: paramsData }) => {
      const { crumb } = handle as IHandle
      return crumb!(paramsData as string, options as any)
    })
    .flat()
  let cx = classNames.bind(s)

  return (
    <div className={s.routes}>
      <TopbarButton to='/' dataTooltipId='home'>
        <HomeIcon />
      </TopbarButton>
      {crumbs?.map((item, i) => (
        <React.Fragment key={i}>
          <span className={s.slash} />
          <span
            className={cx(
              'route',
              !item && 'skeleton',
              item && crumbs.length - 1 === i && 'active'
            )}
          >
            {item}
          </span>
        </React.Fragment>
      ))}
      <BaseToolTip id='home' content='Go to home page' />
    </div>
  )
}
