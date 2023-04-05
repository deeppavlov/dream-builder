import { useState } from 'react'
import BaseModal from '../../ui/BaseModal/BaseModal'
import { useObserver } from '../../hooks/useObserver'
import s from './Modal.module.scss'

export const Modal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleEventUpdate = () => setIsOpen(!isOpen)

  useObserver('Modal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={closeModal}>
      <div className={s.modal}>🎉🎉🎉</div>
    </BaseModal>
  )
}
