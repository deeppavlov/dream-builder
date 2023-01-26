import React from 'react'
import Modal from 'react-modal'
import s from './SidePanel.module.scss'

export interface SidePanelProps {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  position?: Partial<{
    top: number
    left: number
    right: number
    bottom: number
  }>
  children?: React.ReactNode
}

const SidePanel = ({
  isOpen,
  setIsOpen,
  position,
  children,
}: SidePanelProps) => {
  const closeTimeoutMS = 300
  const customStyles = {
    overlay: {
      top: 0,
      left: position?.left ?? 'auto',
      right: position?.right ?? 0,
      bottom: position?.bottom ?? 0,
      background: 'transparent',
      zIndex: 1,
    },
    content: {
      top: position?.top ?? 0,
      left: position?.left ?? 'auto',
      right: position?.right ?? 0,
      bottom: position?.bottom ?? 0,
      overflow: 'visible',
      background: 'none',
      border: 'none',
      borderRadius: 'none',
      padding: 'none',
    },
  }

  const handleCloseModal = () => setIsOpen(false)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      style={customStyles}
      contentLabel='SidePanel'
      closeTimeoutMS={closeTimeoutMS}
      shouldCloseOnOverlayClick={false}
      preventScroll={true}>
      <div className={s.sidePanel} data-modal-type='side-panel'>
        {children}
      </div>
    </Modal>
  )
}

export default SidePanel
