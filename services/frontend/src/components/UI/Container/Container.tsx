import classNames from 'classnames/bind'
import { ReactNode } from 'react'
import s from './Container.module.scss'

interface ContainerProps {
  children?: ReactNode
  gridForCards?: boolean
  heightAuto?: boolean
  layoutForTabs?: boolean
  overflowForAddButton?: boolean
  scroll?: boolean
  gridForRequests?: boolean
  gridForDeploys?: boolean
  overflowVisible?: boolean
  flexEnd?: boolean
  column?: boolean
}

export const Container = ({
  children,
  heightAuto,
  gridForCards,
  overflowForAddButton,
  layoutForTabs,
  scroll,
  gridForRequests,
  gridForDeploys,
  overflowVisible,
  flexEnd,
  column,
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
        scroll && 'scroll',
        gridForRequests && 'gridForRequests',
        gridForDeploys && 'gridForDeploys',
        overflowVisible && 'overflowVisible',
        flexEnd && 'flexEnd',
        column && 'column'
      )}
    >
      {children}
    </div>
  )
}