import classNames from 'classnames/bind'
import { RefObject, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import s from './Modal.module.scss'

export interface IModalProps {
  id?: string
  modalClassName?: string
  backdropClassName?: string
  children?: React.ReactNode
  modalRef?: RefObject<HTMLDivElement>
  isOpen?: boolean
  isRelativeToParent?: boolean
  closeOnBackdropClick?: boolean
  onRequestClose?: () => void
}

const Modal = ({
  id,
  backdropClassName,
  modalClassName,
  children,
  modalRef,
  isOpen = false,
  isRelativeToParent = true,
  closeOnBackdropClick = true,
  onRequestClose,
  ...rest
}: IModalProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(isOpen)
  const [content, setContent] = useState<JSX.Element | null>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  let cx = classNames.bind(s)

  const closeModal = () => {
    if (onRequestClose) onRequestClose()
    setIsVisible(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    const targetIsBackdrop = e.target === backdropRef.current
    if (targetIsBackdrop) closeModal()
  }

  useEffect(() => {
    if (!isVisible) return

    setContent(
      <div
        id={id}
        ref={backdropRef}
        onMouseDown={e => closeOnBackdropClick && handleBackdropClick(e)}
        className={cx('backdrop', backdropClassName)}
        {...rest}
      >
        <div ref={modalRef} className={modalClassName}>
          {children}
        </div>
      </div>
    )
  }, [isVisible, children])

  useEffect(() => {
    const isRequestToOpen = !isVisible && isOpen
    const isRequestToClose = isVisible && !isOpen

    if (isRequestToOpen) return setIsVisible(isOpen)
    if (isRequestToClose) return closeModal()
  }, [isOpen])

  return isVisible
    ? isRelativeToParent
      ? content
      : createPortal(content, document.body)
    : null
}

export default Modal
