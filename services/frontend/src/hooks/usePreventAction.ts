import { useEffect } from 'react'

interface Props {
  onContinue: (handleContinue: () => void) => void
  when: boolean
  unavailableSelectors: string[]
}

export const usePreventAction = ({
  onContinue,
  when,
  unavailableSelectors,
}: Props) => {
  const addClickEventListener = () =>
    window.addEventListener('click', handleWindowClick, true)

  const removeClickEventListener = () =>
    window.removeEventListener('click', handleWindowClick, true)

  const handleContinue = (e: MouseEvent) => {
    removeClickEventListener()
    e.target?.dispatchEvent(new (e as any).constructor(e.type, e))
  }

  const handleWindowClick = (e: MouseEvent) => {
    // TODO: maybe need to refactor.
    // Now on each click current function finding unavailable elements.
    // Might be worth start storing unavailableElements in useState hook
    const unavailableElements = unavailableSelectors
      ?.map(s => {
        const el = document.querySelector(s)
        const elChilds = el?.querySelectorAll('*')
        return elChilds ? [el, ...elChilds] : el ?? null
      })
      .filter(el => el !== null)
      .flat()
    const target = e.target as Element
    const targetIsUnavailable = unavailableElements?.includes(target)

    if (targetIsUnavailable) {
      e.preventDefault()
      e.stopPropagation()
      onContinue(() => handleContinue(e))
    }
  }

  useEffect(() => {
    if (when) addClickEventListener()
    else removeClickEventListener()

    return () => removeClickEventListener()
  }, [when])
}
