import { RefObject, useEffect } from 'react'

export const useChatScroll = (
  ref: RefObject<HTMLElement>,
  deps: Array<any>
) => {
  return useEffect(() => {
    if (ref?.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [...deps])
}
