import i18n from 'i18n'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import store from 'store2'
import { ELOCALES_KEY } from 'types/types'
import { I18N_STORE_KEY, language } from 'constants/constants'
import { useObserver } from 'hooks/useObserver'
import { Button, RadioButton } from 'components/Buttons'
import BaseModal from '../BaseModal/BaseModal'
import s from './ChangeLanguageModal.module.scss'

interface ChangeLanguageModalProps {}

type FormValues = { language: ELOCALES_KEY }

const LANGUAGE = 'language'

export const ChangeLanguageModal: FC<ChangeLanguageModalProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { t } = useTranslation()
  const { register, setValue, watch } = useForm<FormValues>()

  const currentLang = watch(LANGUAGE)
  const locale: ELOCALES_KEY = store(I18N_STORE_KEY)

  const handleEventUpdate = () => setIsOpen(!isOpen)
  const handleCancel = () => setIsOpen(false)
  const handleSave = () => i18n.changeLanguage(currentLang)

  useObserver('ChangeLanguageModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.changelanguage}>
        <div className={s.header}>
          <span className={s.title}>
            {t('change_language_modal.header.title')}
          </span>
          <span className={s.annotation}>
            {t('modals.change_language_modal.header.annotation')}
          </span>
        </div>
        <div className={s.body}>
          {Object.entries(language()).map(language => {
            const id = language[0]
            const lang = language[1]
            return (
              <RadioButton
                props={{
                  ...register(LANGUAGE, { required: true }),
                  defaultChecked: locale === id,
                  onChange: value =>
                    setValue(LANGUAGE, value.target.value as ELOCALES_KEY),
                }}
                tooltipId={id}
                key={id}
                name={id}
                id={lang}
                htmlFor={lang}
                value={id}
              >
                {lang}
              </RadioButton>
            )
          })}
        </div>
        <div className={s.footer}>
          <Button theme='secondary' props={{ onClick: handleCancel }}>
            {t('modals.change_language_modal.footer.cancel')}
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: handleSave,
              disabled: currentLang === locale,
            }}
          >
            {t('modals.change_language_modal.footer.save')}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
