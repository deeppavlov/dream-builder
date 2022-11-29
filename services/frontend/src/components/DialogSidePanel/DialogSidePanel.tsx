import Modal from 'react-modal'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import DialogTextIcon from '@assets/icons/dialogText.svg'
import s from './DialogSidePanel.module.scss'

const customStyles = {
  overlay: {
    background: 'transparent',
  },
  content: {
    top: 64,
    left: 'fit-with',
    right: '0',
    bottom: '0',
    border: 'none',
    background: 'transparent',
    borderRadius: 'none',
    padding: 'none',
  },
}

interface DialogSidePanel {
  isOpen: boolean
  setIsOpen: Function
}

const DialogSidePanel = ({ isOpen, setIsOpen }: DialogSidePanel) => {
  const closeModal = () => setIsOpen(false)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel='Test Dialog'>
      <div className={s.dialogSidePanel}>
        <div className={s.dialogSidePanel__title}>
          <span>Dialog</span>
          <CloseIcon
            className={s.dialogSidePanel__close}
            onClick={closeModal}
          />
        </div>
        <div className={s['dialogSidePanel__chat-box']}></div>
        <div className={s.dialogSidePanel__controls}>
          <img
            src={DialogTextIcon}
            alt='Text'
            className={s['dialogSidePanel__control-btn']}
          />
        </div>
        <textarea
          className={s.dialogSidePanel__textarea}
          name='dialog'
          id='dialog'
          placeholder='Type...'
        />
        <div className={s.dialogSidePanel__btns}>
          <button>Send</button>
        </div>
      </div>
    </Modal>
  )
}

export default DialogSidePanel
