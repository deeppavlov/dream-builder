import { useState } from 'react'
import Modal from 'react-modal'
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
              <span className={s.accentText}> Deepy w/ GPT-3 </span>{' '}
              Distribution for your virtual assistant
            </p>
            <Input />
          </div>
        </div>
        <div className={s.bottom}>
          <button onClick={closeModal} className={s.cancel}>
            Cancel
          </button>
          <button className={s.continue}>Continue</button>
        </div>
      </Modal>
    </>
  )
}
