import { FC } from 'react'
import { Link, useMatches } from 'react-router-dom'
import { usePreview } from '../../context/PreviewProvider'
import s from './Breadcrumbs.module.scss'

interface Props {
  tab?: 'Architecture' | 'Skills'
  children?: React.ReactNode
}

export const Breadcrumbs: FC<Props> = ({ children, tab }) => {
  const matches = useMatches()
  const { isPreview } = usePreview()
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
          const path = crumb?.handle?.props?.children?.split(' ')
          // console.log(`path = `, path)
          isPreview && path?.splice(0, 1, 'Public')
          const newPath = path?.join(' ')
          //   (crumb.handle?.props?.children?.split(' ')[0] = 'Public')
          // let firstWord = crumb.handle?.props?.children?.split(' ')[0]/
          return crumb.pathname !== '/' && crumb.handle
        })}
        {children && <span className={s.slash} />}
        {children}
        {tab && <span className={s.slash} />}
        {tab}
      </div>
    </>
  )
}
