import { useTranslation } from 'react-i18next'
import { ELOCALES_KEY } from 'types/types'
import { TOOLTIP_DELAY } from 'constants/constants'
import { BaseToolTip } from 'components/Menus'
import s from './LanguageToggle.module.scss'

export const LanguageToggle = () => {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'topbar.tooltips',
  })

  const currentLocale = i18n.language
  const toggleLanguage = () =>
    i18n.changeLanguage(
      currentLocale === 'ru' ? ELOCALES_KEY.en : ELOCALES_KEY.ru
    )

  return (
    <button
      data-tooltip-id='language'
      onClick={toggleLanguage}
      className={s.language}
    >
      {currentLocale.toUpperCase()}
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='language'
        content={t('language')}
      />
    </button>
  )
}
