import { useEffect } from 'react'

export const useCheckClickOutside = (
  open: any,
  ref: any,
  handleClick?: (e: MouseEvent) => void
) => {
  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (open && ref.current && !ref?.current.contains(e.target)) {
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
