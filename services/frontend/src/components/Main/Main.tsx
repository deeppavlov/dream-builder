import classNames from 'classnames/bind'
import s from './Main.module.scss'
import { useDrag } from '../../hooks/useDrag'
import { useRef } from 'react'

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
      ref={contentWrapper}
      className={cx('main', sidebar && 'sidebar', editor && 'editor')}>
      {children}
    </div>
  )
}
