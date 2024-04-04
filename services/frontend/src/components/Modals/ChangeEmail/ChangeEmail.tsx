import { useAuth } from 'context'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { api, authApi } from 'api/axiosConfig'
import { getValidationSchema } from 'utils/getValidationSchema'
import { Button } from 'components/Buttons'
import { Input } from 'components/Inputs'
import s from './ChangeEmail.module.scss'

interface FormValues {
  email: string
}

interface IProps {
  onClose: () => void
  onContinue: () => void
}

export const ChangeEmail: FC<IProps> = ({ onClose, onContinue }) => {
  const { reset, control, handleSubmit, setError } = useForm<FormValues>()
  const { setUser, user } = useAuth()
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.add_email_modal',
  })
  const schema = getValidationSchema()

  const onSubmit = async ({ email }: FormValues) => {
    const toastId = toast.loading('Загрузка...')

    if (!user) {
      onClose()
      return
    }

    try {
      const { data } = await authApi.post(
        `/update_user/${user.id}?user_id=${user.id}&new_email=${email}`
      )

      const updatedUser = { ...user, email: data.email }
      setUser(updatedUser)
      reset()
      onContinue()
      toast.success('почта ', {
        id: toastId,
      })
    } catch (err) {
      console.log(err)
      toast.error('!! ', {
        id: toastId,
      })
      // setError('email', { type: 'manual', message: t('error') })
    }
  }

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h3 className={s.title}>{t('title')}</h3>
      </div>

      <div className={s.body}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            name='email'
            control={control}
            props={{ placeholder: t('form.placeholder') }}
            rules={{
              required: schema.globals.required,
              pattern: schema.globals.emailPattern,
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