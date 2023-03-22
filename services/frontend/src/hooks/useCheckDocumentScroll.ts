import { useEffect } from 'react'

export const useCheckDocumentScroll = (
  isOpen: boolean,
  setIsOpen: (state: boolean) => void
) => {
  const handleDocumentScroll = () => setIsOpen(false)

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('scroll', handleDocumentScroll, true)
    } else {
      document.removeEventListener('scroll', handleDocumentScroll, true)
    }

    return () => {
      document.removeEventListener('scroll', handleDocumentScroll, true)
    }
  }, [isOpen])
}
