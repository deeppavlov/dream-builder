import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { toasts } from 'mapping/toasts'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { trigger } from 'utils/events'
import { Button } from 'components/Buttons'
import { BaseModal } from 'components/Modals'
import s from './DeleteAssistantModal.module.scss'

export const DeleteAssistantsModal = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.delete_assistants',
  })
  const [isOpen, setIsOpen] = useState(false)
  const [distNames, setDistNames] = useState<string[]>([])
  const { deleteDists } = useAssistants()

  const handleClose = () => {
    setDistNames([])
    setIsOpen(false)
  }

  const handleDeleteBtnClick = () => {
    trigger('AssistantDeleted', {})

    toast
      .promise(deleteDists.mutateAsync(distNames), toasts().deleteAssistant)
      .finally(handleClose)
  }

  const handleEventUpdate = (data: { detail: { names: string[] } }) => {
    setDistNames(data.detail.names)
    setIsOpen(prev => !prev)
  }

  useObserver('DeleteAssistantsModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={handleClose}>
      <div className={s.deleteAssistantModal}>
        <h4>{t('header')}</h4>
        <span className={s.desc}>{t('subheader')}</span>

        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handleClose }}>
            {t('btns.cancel')}
          </Button>
          <Button
            theme='error'
            props={{
              onClick: handleDeleteBtnClick,
              disabled: deleteDists.isLoading,
            }}
          >
            {t('btns.delete')}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
