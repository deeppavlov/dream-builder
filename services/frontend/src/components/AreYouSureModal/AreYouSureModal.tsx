import { useEffect, useState } from 'react'
import { subscribe, unsubscribe } from '../../utils/events'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import s from './AreYouSureModal.module.scss'
import { useObserver } from '../../hooks/useObserver'

interface Props {
  detail: {
    handleQuit: () => void
  }
}

export const AreYouSureModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleEventUpdate = ({ detail: { handleQuit } }: Props) => {
    setIsOpen(!isOpen)
    handleQuit && handleQuit()
  }

  const handleCancelClick = () => setIsOpen(false)

  const handleYesClick = () => setIsOpen(false)

  useObserver('AreYouSureModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.areYouSure}>
        <div className={s.header}>
          Your data won't be saved! Are you sure
          <br /> you want to quit?
        </div>
        <div className={s.footer}>
          <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            Cancel
          </Button>
          <Button theme='error' props={{ onClick: handleYesClick }}>
            Yes
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
