import { useEffect } from 'react'
// need to fix
export const useOnKey = (func: any, key: string) => {
  const keyDownHandler = event => {
    event.key === key && func()
    event.stopPropagation()
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  })
}
