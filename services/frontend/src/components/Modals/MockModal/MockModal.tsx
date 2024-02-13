import { useTranslation } from 'react-i18next'
import { Button } from 'components/Buttons'
import { BaseModal } from 'components/Modals'
import s from './MockModal.module.scss'

interface IMockModal {
  isOpenModal: boolean
  setIsOpenMock: (state: boolean) => void
}

export const MockModal = (props: IMockModal) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'mock_modal',
  })

  const { isOpenModal, setIsOpenMock } = props
  const handleCancelClick = () => setIsOpenMock(false)

  return (
    <BaseModal isOpen={isOpenModal} setIsOpen={setIsOpenMock}>
      <div className={s.mockModal}>
        <h4>{t('text')}</h4>
        <div className={s.btns}>
          <Button theme='primary' props={{ onClick: handleCancelClick }}>
            {t('btns.close')}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
