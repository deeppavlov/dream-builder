import { useTranslation } from 'react-i18next'
import s from './Badge.module.scss'

export const Badge = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'ribbons' })

  return (
    <div className={s.trapezoid}>
      <span className={s.text}>{t('ready_for_chat')}</span>
    </div>
  )
}
