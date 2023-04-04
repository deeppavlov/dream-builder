import { RefObject } from 'react'

export const сopyToClipboard = (ref: RefObject<HTMLElement>) => {
  navigator.clipboard.writeText(ref?.current?.textContent!)
}
