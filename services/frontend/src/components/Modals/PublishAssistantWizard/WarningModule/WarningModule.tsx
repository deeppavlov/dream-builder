import i18next from 'i18next'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import store from 'store2'
import { HIDE_PUBLISH_ALERT_KEY } from 'constants/constants'
import { Button, Checkbox } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import s from './WarningModule.module.scss'

interface IProps {
  onClose: () => void
  onContinue: () => void
}

export const WarningModule: FC<IProps> = ({ onClose, onContinue }) => {
  const { t } = useTranslation()
  const hidePublishAlert = store(HIDE_PUBLISH_ALERT_KEY)
  const { register } = useForm({
    defaultValues: {
      [HIDE_PUBLISH_ALERT_KEY]: hidePublishAlert,
    },
  })

  const handleChange = (v: any) =>
    store(HIDE_PUBLISH_ALERT_KEY, v.target.checked)

  return (
    <div className={s.publishWarningModal}>
      <div className={s.header}>
        <div className={s.circle}>
          <SvgIcon iconName={'attention'} />
        </div>
        <h3 className={s.title}>{t('modals.publish_warning_modal.title')}</h3>
      </div>
      <div className={s.body}>
        <div className={s.upper}>{t('modals.publish_warning_modal.upper')}</div>
        <div className={s.bottom}>
          {t('modals.publish_warning_modal.bottom')}
        </div>
      </div>
      <div className={s.footer}>
        <Button theme='secondary' props={{ onClick: onClose }}>
          {t('modals.publish_warning_modal.btns.cancel')}
        </Button>
        <Button theme='primary' props={{ onClick: onContinue }}>
          {t('modals.publish_warning_modal.btns.continue')}
        </Button>
      </div>
      <div className={s.checkbox}>
        <Checkbox
          theme='secondary'
          name='alertMessage'
          label={i18next.t('modals.publish_assistant.checkbox')}
          props={{
            ...register(HIDE_PUBLISH_ALERT_KEY),
            onChange: v => handleChange(v),
          }}
        />
      </div>
    </div>
  )
}
