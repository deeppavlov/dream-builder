import { useEffect } from 'react'
import { subscribe, unsubscribe } from '../utils/events'

export const useObserver = (
  eventName: string,
  callback: (data: any) => void
) => {
  useEffect(() => {
    subscribe(eventName, callback)
    return () => unsubscribe(eventName, callback)
  }, [])
}
