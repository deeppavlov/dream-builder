import { useState } from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import { Input } from '../../ui/Input/Input'
import s from './CreateAssistantModal.module.scss'

export const CreateAssistantModal = ({ children }: any) => {
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
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={s.modal}
        contentLabel='create'>
        <button className={s.close} onClick={closeModal}>
          <Close />
        </button>
        <div className={s.body}>
          <h4>Create a new virtual assistant</h4>
          <div className={s.inputArea}>
            <p>
              You will Use
              <span className={s.accentText}> Name of the Bot </span>
              Distribution for your virtual assistant
            </p>
            <Input />
          </div>
        </div>
        <div className={s.bottom}>
          <button onClick={closeModal} className={s.cancel}>
            Cancel
          </button>
          <Link to='/editor'>
            <button className={s.continue}>Continue</button>
          </Link>
        </div>
      </Modal>
    </>
  )
}
