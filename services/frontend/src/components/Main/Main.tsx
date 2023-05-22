import classNames from 'classnames/bind'
import { FC, ReactNode, useRef } from 'react'
import { useDrag } from '../../hooks/useDrag'
import s from './Main.module.scss'

interface Props {
  children: ReactNode
  sidebar?: boolean
  editor?: boolean
  draggable?: boolean
  fullWidth?: boolean
  column?: boolean
}

export const Main: FC<Props> = ({
  children,
  sidebar,
  editor,
  draggable,
  fullWidth,
  column,
}) => {
  let cx = classNames.bind(s)
  const contentWrapper = useRef<HTMLDivElement>(null)
  draggable && useDrag(contentWrapper)
  return (
    <div
      data-id='main'
      ref={contentWrapper}
      className={cx(
        'main',
        sidebar && 'sidebar',
        editor && 'editor',
        fullWidth && 'fullWidth',
        column && 'column'
      )}
    >
      {children}
    </div>
  )
}
