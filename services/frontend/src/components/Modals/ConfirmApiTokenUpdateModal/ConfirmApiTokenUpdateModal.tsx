import { useState } from 'react'
import { useObserver } from 'hooks/useObserver'
import { Button } from 'components/Buttons'
import { BaseModal } from 'components/Modals'
import s from './ConfirmApiTokenUpdateModal.module.scss'

interface Props {
  detail: {
    serviceName: string
    onContinue?: () => void
    onCancel?: () => void
  }
}

export const ConfirmApiTokenUpdate = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [serviceName, setServiceName] = useState<string | null>(null)
  const [onContinue, setOnContinue] = useState<Function | null>(null)
  const [onCancel, setOnCancel] = useState<Function | null>(null)

  const handleEventUpdate = ({
    detail: { serviceName, onContinue, onCancel },
  }: Props) => {
    setServiceName(serviceName ?? null)
    if (onContinue) setOnContinue(() => onContinue)
    if (onCancel) setOnCancel(() => onCancel)
    setIsOpen(true)
  }

  const handleCancelClick = () => {
    if (onCancel) onCancel()
    setIsOpen(false)
  }

  const handleUpdateBtnClick = () => {
    if (onContinue) onContinue()
    setIsOpen(false)
  }

  useObserver('ConfirmApiTokenUpdateModal', handleEventUpdate)

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      type='quit'
      handleClose={() => onCancel && onCancel()}
    >
      <div className={s.confirmApiTokenUpdate}>
        <h4>
          Do you want to update a <mark>{serviceName}</mark> token you have
          already added?
        </h4>
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            Cancel
          </Button>
          <Button theme='primary' props={{ onClick: handleUpdateBtnClick }}>
            Update
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
