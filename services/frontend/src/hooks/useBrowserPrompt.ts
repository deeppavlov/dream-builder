/**
 * Prompts a user when they exit the page
 */
import { useCallback, useContext, useEffect } from 'react'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

type TConfirmNavigation = () => void

interface IBrowserPrompt {
  message?: string
  when?: boolean
  onConfirmExit?: (onConfirm: () => void) => void
}

function useConfirmExit(
  confirmExit: (confirmNavigation: TConfirmNavigation) => void,
  when: boolean
) {
  const { navigator } = useContext(NavigationContext)

  useEffect(() => {
    if (!when) return

    const push = navigator.push

    navigator.push = (...args: Parameters<typeof push>) => {
      const confirm = () => push(...args)
      confirmExit(confirm)
    }

    return () => {
      navigator.push = push
    }
  }, [navigator, confirmExit, when])
}

export function useBrowserPrompt({
  message,
  when = true,
  onConfirmExit,
}: IBrowserPrompt) {
  useEffect(() => {
    if (when) {
      window.onbeforeunload = () => message
    }

    return () => {
      window.onbeforeunload = null
    }
  }, [message, when])

  const confirmExit = useCallback(
    (confirmNavigation: TConfirmNavigation) => {
      const onConfirm = () => {
        confirmNavigation()
      }

      if (onConfirmExit) onConfirmExit(onConfirm)
    },
    [message]
  )

  useConfirmExit(confirmExit, when)
}
