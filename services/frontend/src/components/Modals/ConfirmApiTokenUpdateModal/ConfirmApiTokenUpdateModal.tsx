import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.confirm_api_key_update',
  })
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
      handleClose={() => onCancel && onCancel()}
      data-modal-type='quit'
    >
      <div className={s.confirmApiTokenUpdate}>
        <h4>
          <Trans
            i18nKey='modals.confirm_api_key_update.header'
            values={{ serviceName }}
          />
        </h4>
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            {t('btns.cancel')}
          </Button>
          <Button theme='primary' props={{ onClick: handleUpdateBtnClick }}>
            {t('btns.update')}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
