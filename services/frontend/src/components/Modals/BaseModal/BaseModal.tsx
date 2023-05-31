import classNames from 'classnames/bind'
import React from 'react'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import Modal, { IModalProps } from 'components/UI/Modal/Modal'
import s from './BaseModal.module.scss'

interface IProps extends IModalProps {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  handleClose?: () => void
  children?: React.ReactNode
}

const BaseModal = ({
  isOpen,
  setIsOpen,
  handleClose,
  children,
  modalClassName,
  ...rest
}: IProps) => {
  const cx = classNames.bind(s)

  const closeModal = () => {
    setIsOpen(false)
    handleClose && handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      modalClassName={cx('baseModal', modalClassName)}
      isRelativeToParent={false}
      {...rest}
    >
      <button onClick={closeModal}>
        <CloseIcon className={s.close} />
      </button>
      {children}
    </Modal>
  )
}

export default BaseModal
