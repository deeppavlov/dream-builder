import classNames from 'classnames/bind'
import { ReactNode } from 'react'
import s from './Container.module.scss'

interface ContainerProps {
  children?: ReactNode
  gridForCards?: boolean
  heightAuto?: boolean
  layoutForTabs?: boolean
  overflowForAddButton?: boolean
  flexRow?: boolean
}

export const Container = ({
  children,
  heightAuto,
  gridForCards,
  overflowForAddButton,
  layoutForTabs,
  flexRow,
}: ContainerProps) => {
  const cx = classNames.bind(s)
  return (
    <div
      className={cx(
        'container',
        heightAuto && 'heightAuto',
        gridForCards && 'gridForCards',
        layoutForTabs && 'layoutForTabs',
        overflowForAddButton && 'overflowForAddButton',
        flexRow && 'flexRow'
      )}
    >
      {children}
    </div>
  )
}
