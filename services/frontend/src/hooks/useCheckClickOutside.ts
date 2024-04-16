import { MutableRefObject, useEffect } from 'react'

export const useCheckClickOutside = (
  open: boolean,
  ref: MutableRefObject<HTMLDivElement | null>,
  handleClick?: (e: MouseEvent) => void,
  parent?: HTMLElement | null,
  closeOnRefClick?: boolean
) => {
  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      const targetNode = e.target as Node | null
      if (
        open &&
        ref.current &&
        !ref?.current.contains(targetNode) &&
        !parent?.contains(targetNode)
      ) {
        handleClick && handleClick(e)
      }

      if (
        closeOnRefClick &&
        open &&
        ref.current &&
        ref?.current.contains(targetNode)
      ) {
        targetNode?.dispatchEvent(new Event('click', e))
        handleClick && handleClick(e)
      }

      document.removeEventListener('mousedown', checkIfClickedOutside)
    }

    if (open) {
      document.addEventListener('mousedown', checkIfClickedOutside)
    }

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [open])
}
