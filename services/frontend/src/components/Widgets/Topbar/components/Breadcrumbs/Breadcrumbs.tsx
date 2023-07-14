import { ReactComponent as HomeIcon } from '@assets/icons/home.svg'
import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMatches } from 'react-router-dom'
import { IRouterCrumb } from 'types/types'
import { TopbarButton } from 'components/Buttons'
import { BaseToolTip } from 'components/Menus'
import s from './Breadcrumbs.module.scss'

interface IHandle {
  crumb?: (props?: Partial<IRouterCrumb>) => any
}

export const Breadcrumbs = () => {
  const matches = useMatches()
  const { UIOptions } = useUIOptions()
  const { t } = useTranslation()
  let crumbs = matches
    // Filter routes with crumbs
    .filter(match => Boolean((match.handle as IHandle)?.crumb))
    // Setting data to route crumbs
    .map(({ handle, data: routingName }) => {
      const { crumb } = handle as IHandle
      return crumb!({
        params: routingName as string,
        ui: UIOptions as any,
        t,
      })
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
      <BaseToolTip id='home' content={t('topbar.tooltips.home')} />
    </div>
  )
}
