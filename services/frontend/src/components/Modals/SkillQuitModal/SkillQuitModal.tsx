import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.skill_prompt_quit',
  })
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
        <h4>{t('header')}</h4>
        <span className={s.desc}>{t('subheader')}</span>
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            {t('btns.cancel')}
          </Button>
          <Button theme='primary' props={{ onClick: handleCloseClick }}>
            {t('btns.close')}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
