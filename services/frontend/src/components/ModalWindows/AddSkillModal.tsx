import { useState } from 'react'
import Modal from 'react-modal'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import s from './AddSkillModal.module.scss'

export const AddSkillModal = ({ children }: any) => {
  const [modalIsOpen, setIsOpen] = useState(false)
  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }
  return (
    <>
      <button className={s.open} onClick={openModal}>
        {children}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={s.modal}
        contentLabel='create'>
        <button className={s.close} onClick={closeModal}>
          <Close />
        </button>
        <div className={s.body}>
          <h4>
            Do you want to create new bot with this skill or add to existing
            bot?
          </h4>
        </div>
        <div className={s.bottom}>
          <button onClick={closeModal} className={s.cancel}>
            Create a New Bot
          </button>
          <button className={s.continue}>Add to Existing Bot</button>
        </div>
      </Modal>
    </>
  )
}
