import { useEffect } from 'react'
import { TEvents } from '../types/types'
import { subscribe, unsubscribe } from '../utils/events'

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
