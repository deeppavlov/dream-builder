import React from 'react'
import Modal from 'react-modal'
import s from './SidePanel.module.scss'

export interface SidePanelProps {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  handleClose?: () => void
  position?: Partial<{
    top: number | 'auto'
    left: number | 'auto'
    right: number | 'auto'
    bottom: number | 'auto'
  }>
  children?: React.ReactNode
  transition?: 'left' | 'right' | 'none'
}

const SidePanel = ({
  isOpen,
  setIsOpen,
  handleClose,
  position,
  children,
  transition = 'right',
}: SidePanelProps) => {
  const closeTimeoutMS = transition === 'none' ? 0 : 300
  const customStyles = {
    overlay: {
      top: 64,
      left: 'auto',
      right: transition === 'left' ? 'auto' : position?.right ?? 0,
      bottom: position?.bottom ?? 0,
      background: 'transparent',
      zIndex: 6,
    },
    content: {
      top: position?.top ?? 0,
      left: transition === 'left' ? 80 : position?.left ?? 'auto',
      right: transition === 'left' ? 'auto' : position?.right ?? 0,
      bottom: position?.bottom ?? 0,
      overflow: 'visible',
      background: 'none',
      border: 'none',
      borderRadius: 'none',
      padding: 'none',
    },
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    handleClose && handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      shouldCloseOnEsc={false}
      style={customStyles}
      contentLabel='SidePanel'
      closeTimeoutMS={closeTimeoutMS}
      shouldCloseOnOverlayClick={false}
      preventScroll={true}
      shouldFocusAfterRender={false}
    >
      <div
        className={s.sidePanel}
        data-modal-type='side-panel'
        data-transition={transition}
      >
        {children}
      </div>
    </Modal>
  )
}

export default SidePanel
