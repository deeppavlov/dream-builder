import { useEffect, useState } from 'react'
import { subscribe, unsubscribe } from '../../utils/events'
import BaseModal from '../../ui/BaseModal/BaseModal'
import s from './Modal.module.scss'

export const Modal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleEventUpdate = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    subscribe('Modal', handleEventUpdate)
    return () => unsubscribe('Modal', handleEventUpdate)
  }, [])
  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={closeModal}>
      <div className={s.modal}>🎉🎉🎉</div>
    </BaseModal>
  )
}
