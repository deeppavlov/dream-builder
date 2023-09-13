import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getValidationSchema } from 'utils/getValidationSchema'
import { Button } from 'components/Buttons'
import { Input } from 'components/Inputs'
import s from './AddEmailModule.module.scss'

interface FormValues {
  email: string
}

interface IProps {
  onClose: () => void
  onContinue: () => void
}

export const AddEmailModule: FC<IProps> = ({ onClose, onContinue }) => {
  const { reset, control, handleSubmit } = useForm<FormValues>()
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.add_email_modal',
  })
  const schema = getValidationSchema()

  const onSubmit = ({ email }: FormValues) => {
    console.log(email)
    // обновляем юзера
    reset()
    onContinue()
  }

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h3 className={s.title}>{t('title')}</h3>
        <span className={s.subtitle}>{t('subtitle')}</span>
      </div>

      <div className={s.body}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            name='email'
            control={control}
            label={t('form.label')}
            props={{ placeholder: t('form.placeholder') }}
            rules={{
              required: schema.global.required,
              pattern: schema.global.emailPattern,
            }}
          />
        </form>
      </div>

      <div className={s.footer}>
        <Button theme='secondary' props={{ onClick: onClose }}>
          {t('btns.cancel')}
        </Button>
        <Button theme='primary' props={{ onClick: handleSubmit(onSubmit) }}>
          {t('btns.continue')}
        </Button>
      </div>
    </div>
  )
}
