import classNames from 'classnames/bind'
import { useRef } from 'react'
import { useDrag } from '../../hooks/useDrag'
import s from './Main.module.scss'

interface MainProps {
  children: React.ReactNode
  sidebar?: boolean
  editor?: boolean
  draggable?: boolean
}

export const Main = ({ children, sidebar, editor, draggable }: MainProps) => {
  let cx = classNames.bind(s)
  const contentWrapper = useRef<HTMLDivElement>(null)
  draggable && useDrag(contentWrapper)
  return (
    <div
      data-id='main'
      ref={contentWrapper}
      className={cx('main', sidebar && 'sidebar', editor && 'editor')}
    >
      {children}
    </div>
  )
}
