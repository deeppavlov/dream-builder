import React, { useEffect } from 'react'

export const useDrag = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!ref.current) return
    let isDown = false
    let isScrolling = false
    let startX: number
    let scrollLeft: number

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation()
      ref.current!.removeEventListener('click', handleClick)
    }

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true
      startX = e.pageX - ref.current!.offsetLeft
      scrollLeft = ref.current!.scrollLeft
    }

    const handleMouseLeave = () => (isDown = false)

    const handleMouseUp = (e: MouseEvent) => {
      isDown = false
      if (isScrolling) {
        isScrolling = false
        ref.current!.addEventListener('click', handleClick)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      isScrolling = true
      const x = e.pageX - ref.current!.offsetLeft
      const walk = x - startX
      ref.current!.scrollLeft = scrollLeft - walk
    }

    ref.current.addEventListener('mousedown', handleMouseDown)
    ref.current.addEventListener('mouseleave', handleMouseLeave)
    ref.current.addEventListener('mouseup', handleMouseUp)
    ref.current.addEventListener('mousemove', handleMouseMove)

    return () => {
      ref.current?.removeEventListener('click', handleClick)
      ref.current?.removeEventListener('mousedown', handleMouseDown)
      ref.current?.removeEventListener('mouseleave', handleMouseLeave)
      ref.current?.removeEventListener('mouseup', handleMouseUp)
      ref.current?.removeEventListener('mousemove', handleMouseMove)
    }
  }, [ref])
  return ref
}
