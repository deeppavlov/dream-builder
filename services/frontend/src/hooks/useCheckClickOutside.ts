import { useEffect } from 'react'

export const useCheckClickOutside = (open: any, ref: any, setOpen: any) => {
  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (open && ref.current && !ref?.current.contains(e.target)) {
        setOpen(false)
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
