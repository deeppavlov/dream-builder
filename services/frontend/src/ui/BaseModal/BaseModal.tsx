import React, { FC } from 'react'
import Modal from 'react-modal'
import classNames from 'classnames/bind'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import s from './BaseModal.module.scss'

export interface BaseModalInterface {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  handleClose?: () => void
  customStyles?: Modal.Styles
  children?: React.ReactNode
  skillsListModal?: boolean
}

const BaseModal: FC<BaseModalInterface> = ({
  isOpen,
  setIsOpen,
  handleClose,
  customStyles,
  children,
  skillsListModal,
}) => {
  const styles: Modal.Styles = {
    overlay: Object.assign(
      {},
      {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10,
      },
      customStyles?.overlay
    ),
    content: Object.assign(
      {},
      {
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
      customStyles?.content
    ),
  }
  const cx = classNames.bind(s)

  const closeModal = () => {
    setIsOpen(false)
    handleClose && handleClose()
  }
  const cx = classNames.bind(s)
  return isOpen ? (
    <Modal style={styles} isOpen={isOpen} onRequestClose={closeModal}>
      <div className={cx('baseModal', skillsListModal && 'skillsListModal')}>
        <button onClick={closeModal}>
          <CloseIcon className={s.close} />
        </button>
        {children}
      </div>
    </Modal>
  ) : null
}

export default BaseModal
