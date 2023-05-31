import { useState } from 'react'
import { useObserver } from 'hooks/useObserver'
import { Button } from 'components/Buttons'
import { BaseModal } from 'components/Modals'
import s from './SkillQuitModal.module.scss'

interface Props {
  detail: {
    handleQuit: () => void
  }
}

export const SkillQuitModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [handleQuit, setHandleQuit] = useState<Function | null>(null)

  const handleEventUpdate = ({ detail: { handleQuit } }: Props) => {
    setIsOpen(true)
    handleQuit && setHandleQuit(() => handleQuit)
  }

  const handleCancelClick = () => setIsOpen(false)

  const handleCloseClick = () => {
    setIsOpen(false)
    handleQuit && handleQuit()
  }

  useObserver('SkillQuitModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} data-modal-type='quit'>
      <div className={s.skillQuitModal}>
        <h4>Do you want to close skill editing page?</h4>
        <span className={s.desc}>
          Your data won’t be saved, save it before closing.
        </span>
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            Cancel
          </Button>
          <Button theme='primary' props={{ onClick: handleCloseClick }}>
            Close
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
