import { TEvents } from '../types/types'
import { subscribe, unsubscribe } from '../utils/events'
import { useEffect } from 'react'

export const useObserver = (
  eventName: TEvents,
  callback: (data: any) => void,
  dependencyList?: any[]
) => {
  useEffect(() => {
    subscribe(eventName, callback)
    return () => unsubscribe(eventName, callback)
  }, dependencyList ?? [])
}
