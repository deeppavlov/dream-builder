import { useAuth, useUIOptions } from 'context'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { getTariffPlans } from 'api/user/getTariffPlans'
import { consts } from 'utils/consts'
import { getValidationSchema } from 'utils/getValidationSchema'
import { Button } from 'components/Buttons'
import { Input } from 'components/Inputs'
import BaseModal from '../BaseModal/BaseModal'
import s from './TariffsModal.module.scss'

interface FormValues {
  email: string
}

export const TariffsModal = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const schema = getValidationSchema()
  const { reset, control, handleSubmit } = useForm<FormValues>({
    defaultValues: { email: user?.email ?? '' },
  })

  const { UIOptions, setUIOption } = useUIOptions()
  const isOpen = UIOptions[consts.TARIFFS_MODAL_IS_OPEN]

  const tariffs = useQuery(['tariffPlans'], getTariffPlans, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: isOpen,
  })

  const submit = ({ email }: FormValues) => {
    console.log(email)
    setUIOption({ name: consts.TARIFFS_MODAL_IS_OPEN, value: false })
    reset()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={open => {
        setUIOption({ name: consts.TARIFFS_MODAL_IS_OPEN, value: open })
      }}
      modalClassName={s.modal}
    >
      <div className={s.container}>
        <div className={s.header}>
          <h4>{t('modals.tariffs_modal.header')}</h4>
        </div>
        <div className={s.body}>
          {tariffs.data
            ?.sort(({ id: id1 }, { id: id2 }) => id1 - id2)
            .map(tariff => {
              return (
                <div key={tariff.id} className={s.tariffCard}>
                  <div className={s.cardHeader}>
                    {tariff.name}
                    {user?.plan.id === tariff.id && (
                      <span className={s.small}>
                        {t('modals.tariffs_modal.current_plan')}
                      </span>
                    )}
                  </div>
                  <div className={s.string}>
                    <span>{t('modals.tariffs_modal.deployment_limit')} </span>
                    {tariff.max_active_assistants}
                  </div>
                  <div className={s.string}>
                    <span>{t('modals.tariffs_modal.price')} </span>
                    {tariff.price}
                  </div>
                </div>
              )
            })}
        </div>

        <div className={s.footer}>
          <div className={s.formHeader}>
            {t('modals.tariffs_modal.form_header')}
          </div>
          <form onSubmit={handleSubmit(submit)} className={s.form}>
            <Input
              big
              label={t('modals.tariffs_modal.input_label')}
              name='email'
              control={control}
              props={{
                placeholder: t('modals.tariffs_modal.input_placeholder'),
              }}
              rules={{
                required: schema.globals.required,
                pattern: schema.globals.emailPattern,
              }}
            />
            <Button theme='primary' props={{ type: 'submit' }}>
              {t('modals.tariffs_modal.send')}
            </Button>
          </form>
        </div>
      </div>
    </BaseModal>
  )
}
