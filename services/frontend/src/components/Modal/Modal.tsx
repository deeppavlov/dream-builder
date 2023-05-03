import { useState } from 'react'
import { useObserver } from '../../hooks/useObserver'
import BaseModal from '../../ui/BaseModal/BaseModal'
import s from './Modal.module.scss'

export const Modal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleEventUpdate = () => setIsOpen(prev => !prev)

  useObserver('Modal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={closeModal}>
      <div className={s.modal}>🎉🎉🎉</div>
    </BaseModal>
  )
}
