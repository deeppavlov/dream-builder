import React from 'react'
import Modal from 'react-modal'
import s from './SidePanel.module.scss'

export interface SidePanelProps extends React.PropsWithChildren {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  position?: Partial<{
    top: number
    left: number
    right: number
    bottom: number
  }>
  disabled?: boolean
}

const SidePanel = ({
  isOpen,
  setIsOpen,
  position,
  disabled,
  children,
}: SidePanelProps) => {
  const customStyles = {
    overlay: {
      background: 'transparent',
      zIndex: 4,
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
  const closeModal = () => setIsOpen(false)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel='SidePanel'
      closeTimeoutMS={300}>
      <div className={s.sidePanel} data-modal-type='side-panel'>
        {children}
      </div>
    </Modal>
  )
}

export default SidePanel
