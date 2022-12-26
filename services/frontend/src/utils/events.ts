import {
  CustomEventListener as EListener,
  CustomEventName as EName,
} from '../types/types'

function subscribe(eventName: EName, listener: EListener) {
  document.addEventListener(eventName, listener)
}

function unsubscribe(eventName: EName, listener: EListener) {
  document.removeEventListener(eventName, listener)
}

function trigger(eventName: EName, data: any) {
  const event = new CustomEvent(eventName, { detail: data })
  document.dispatchEvent(event)
}

export { trigger, subscribe, unsubscribe }
