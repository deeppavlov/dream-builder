import { useEffect } from 'react'

export const useOnlyOnMount = (func: any) => {
  return useEffect(() => {
    func()
  }, [])
}
