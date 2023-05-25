import classNames from 'classnames/bind'
import { useTranslation } from 'react-i18next'
import store from 'store2'
import { I18N_STORE_KEY } from '../../constants/constants'
import { ELOCALES_KEY, ELOCALES_TITLE } from '../../types/types'
import s from './SwitchLanguageButton.module.scss'

export const SwitchLanguageButton = () => {
  const cx = classNames.bind(s)

  const activeLocale: ELOCALES_KEY = store(I18N_STORE_KEY) || ELOCALES_KEY.en

  const { i18n } = useTranslation()

  const enHandler = () => i18n.changeLanguage(ELOCALES_KEY.en)
  const ruHandler = () => i18n.changeLanguage(ELOCALES_KEY.ru)

  return (
    <div className={s.container}>
      <button
        onClick={enHandler}
        className={cx(
          'switch',
          'left',
          activeLocale === ELOCALES_KEY.en && 'active'
        )}
      >
        {ELOCALES_TITLE.EN}
      </button>
      <button
        onClick={ruHandler}
        className={cx(
          'switch',
          'right',
          activeLocale === ELOCALES_KEY.ru && 'active'
        )}
      >
        {ELOCALES_TITLE.RU}
      </button>
    </div>
  )
}
