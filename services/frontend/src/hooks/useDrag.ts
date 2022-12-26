import { useEffect } from 'react'

export const useDrag = ref => {
  useEffect(() => {
    if (!ref.current) return
    let isDown = false
    let startX: number
    let scrollLeft: number

    ref.current.addEventListener('mousedown', e => {
      isDown = true
      startX = e.pageX - ref.current.offsetLeft
      scrollLeft = ref.current.scrollLeft
    })
    ref.current.addEventListener('mouseleave', () => {
      isDown = false
    })
    ref.current.addEventListener('mouseup', () => {
      isDown = false
    })
    ref.current.addEventListener('mousemove', e => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - ref.current.offsetLeft
      const walk = x - startX
      ref.current.scrollLeft = scrollLeft - walk
    })
  }, [ref])
  return ref
}
