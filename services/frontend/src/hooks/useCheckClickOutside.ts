import { useEffect } from 'react'

export const useCheckClickOutside = (
  open: any,
  ref: any,
  handleClick?: (e: MouseEvent) => void,
  closeOnRefClick?: boolean
) => {
  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (open && ref.current && !ref?.current.contains(e.target)) {
        handleClick && handleClick(e)
      }

      if (
        closeOnRefClick &&
        open &&
        ref.current &&
        ref?.current.contains(e.target)
      ) {
        e.target?.dispatchEvent(new Event('click', e))
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
