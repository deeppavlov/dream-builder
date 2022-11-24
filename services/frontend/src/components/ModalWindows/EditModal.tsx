import { useState } from 'react'
import Modal from 'react-modal'
import { TextArea } from '../../ui/TextArea/TextArea'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import s from './EditModal.module.scss'

export const EditModal = ({ children }: any) => {
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
          <h4>GPT-3 Chit-Chat</h4>
          <TextArea label='Enter prompt' />
        </div>
        <div className={s.bottom}>
          <button onClick={closeModal} className={s.cancel}>
            Cancel
          </button>
          <button onClick={closeModal} className={s.continue}>
            Save
          </button>
        </div>
      </Modal>
    </>
  )
}
