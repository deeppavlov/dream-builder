import React, { useState } from 'react'
import Modal from 'react-modal'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import s from './BaseModal.module.scss'

export interface BaseModalInterface {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  handleClose?: () => void
  customStyles?: Modal.Styles
  children?: React.ReactNode
}

const BaseModal = ({
  isOpen,
  setIsOpen,
  handleClose,
  customStyles,
  children,
}: BaseModalInterface) => {
  const closeModal = () => {
    setIsOpen(false)
    handleClose && handleClose()
  }

  return isOpen ? (
    <Modal
      style={{
        ...{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10,
          },
          content: {
            width: 'fit-content',
            height: 'fit-content',
            top: '50%',
            left: '50%',
            right: 0,
            bottom: 0,
            overflow: 'visible',
            background: 'none',
            border: 'none',
            borderRadius: 'none',
            padding: 'none',
            transform: 'translate(-50%, -50%)',
          },
        },
        ...customStyles,
      }}
      isOpen={isOpen}
      onRequestClose={closeModal}>
      <div className={s.baseModal}>
        <button onClick={closeModal}>
          <CloseIcon className={s.baseModal__close} />
        </button>
        {children}
      </div>
    </Modal>
  ) : null
}

export default BaseModal
