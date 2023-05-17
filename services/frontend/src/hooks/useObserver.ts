import { useEffect } from 'react'
import { TModals } from '../types/types'
import { subscribe, unsubscribe } from '../utils/events'

export const useObserver = (
  eventName: TModals,
  callback: (data: any) => void
) => {
  useEffect(() => {
    subscribe(eventName, callback)
    return () => unsubscribe(eventName, callback)
  }, [])
}
