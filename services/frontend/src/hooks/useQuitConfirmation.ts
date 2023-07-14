import { useEffect } from 'react'

interface Props {
  activeElement: React.RefObject<HTMLElement>
  quitHandler: (continueExit: Function) => void
  isActive: boolean
  availableSelectors?: string[]
}

export const useQuitConfirmation = ({
  activeElement,
  quitHandler,
  isActive,
  availableSelectors,
}: Props) => {
  const addClickEventListener = () =>
    window.addEventListener('click', handleWindowClick, true)

  const removeClickEventListener = () =>
    window.removeEventListener('click', handleWindowClick, true)

  const continueExit = (e: MouseEvent) => {
    removeClickEventListener()
    e.target?.dispatchEvent(new (e as any).constructor(e.type, e))
  }

  const handleWindowClick = (e: MouseEvent) => {
    const quitModals = [
      ...document.querySelectorAll('[data-modal-type="quit"]'),
    ]
      .map(el => [el, ...el.querySelectorAll('*')])
      ?.flat()
    const availableElements = availableSelectors
      ?.map(s => {
        const el = document.querySelector(s)
        const elChilds = el?.querySelectorAll('*')
        return elChilds ? [el, ...elChilds] : el ?? null
      })
      .filter(el => el !== null)
      .flat()
    const target = e.target as Element
    const isQuitModal = quitModals.includes(target)
    const isOutsideElement =
      !activeElement?.current?.contains(target) &&
      !availableElements?.includes(target)

    if (!isQuitModal && isOutsideElement) {
      e.preventDefault()
      e.stopPropagation()
      quitHandler(() => continueExit(e))
    }
  }

  useEffect(() => {
    if (isActive) addClickEventListener()
    else removeClickEventListener()

    return () => removeClickEventListener()
  }, [isActive])
}
