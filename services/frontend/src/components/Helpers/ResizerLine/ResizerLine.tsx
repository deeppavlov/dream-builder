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
    resizerRef.current.addEventListener('touchstart', initResize, false)
    resizerRef.current.addEventListener('mousedown', initResize, false)

    return () => {
      resizerRef.current?.removeEventListener('touchstart', initResize, false)
      resizerRef.current?.removeEventListener('mousedown', initResize, false)
    }
  }, [ref?.current, resizerRef?.current])

  const initResize = () => {
    setIsDragging(true)
    window.addEventListener('mousemove', mouseResize, false)
    window.addEventListener('mouseup', stopResize, false)
    window.addEventListener('touchmove', touchResize, false)
    window.addEventListener('touchend', stopResize, false)
  }

  const resize = (computedWidth: number) => {
    if (!element) return

    // if (draggedWidth < minWidth) return

    element.style.width = `${computedWidth}px`
  }

  const mouseResize = (e: MouseEvent) => {
    if (!element) return

    var computedWidth = element.getBoundingClientRect().right - e?.clientX - 20

    resize(computedWidth)
  }

  const touchResize = (e: TouchEvent) => {
    if (!element) return

    var computedWidth =
      element.getBoundingClientRect().right - e?.targetTouches?.[0].clientX - 20

    resize(computedWidth)
  }

  const stopResize = () => {
    setIsDragging(false)
    window.removeEventListener('mousemove', mouseResize, false)
    window.removeEventListener('mouseup', stopResize, false)
    window.removeEventListener('touchmove', touchResize, false)
    window.removeEventListener('touchend', stopResize, false)
  }

  return (
    <div
      className={cx('resizer', isDragging && 'active')}
      ref={resizerRef}
    ></div>
  )
}
