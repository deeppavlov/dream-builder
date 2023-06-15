import classNames from 'classnames/bind'
import { useEffect, useRef, useState } from 'react'
import s from './ResizerLine.module.scss'

interface IProps {
  resizableElementRef: React.MutableRefObject<any>
}

export const ResizerLine = ({ resizableElementRef: ref }: IProps) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const resizerRef = useRef<HTMLDivElement>(null)
  let cx = classNames.bind(s)

  useEffect(() => {
    const isElements = !!ref?.current && !!resizerRef?.current

    if (!isElements) return

    setElement(ref.current)
    resizerRef.current.addEventListener('mousedown', initResize, false)

    return () => {
      resizerRef.current?.removeEventListener('mousedown', initResize, false)
    }
  }, [ref?.current, resizerRef?.current])

  const initResize = () => {
    setIsDragging(true)
    window.addEventListener('mousemove', Resize, false)
    window.addEventListener('mouseup', stopResize, false)
  }

  const Resize = (e: MouseEvent) => {
    if (!element) return

    var computedWidth = element.getBoundingClientRect().right - e.clientX - 20

    // if (draggedWidth < minWidth) return

    element.style.width = `${computedWidth}px`
  }

  const stopResize = () => {
    setIsDragging(false)
    window.removeEventListener('mousemove', Resize, false)
    window.removeEventListener('mouseup', stopResize, false)
  }

  return (
    <div
      className={cx('resizer', isDragging && 'active')}
      ref={resizerRef}
    ></div>
  )
}
