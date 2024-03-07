import classNames from 'classnames/bind'
import { useTranslation } from 'react-i18next'
import { SvgIcon } from 'components/Helpers'
import s from './ErrorCard.module.scss'

interface IProps {
  message: string | React.ReactElement
  type: 'warning' | 'error'
  isWhite?: boolean
}

const icon = {
  warning: 'warning_triangle',
  error: 'error_circle',
}

export const ErrorCard = ({ message, type, isWhite }: IProps) => {
  const cx = classNames.bind(s)
  const { t } = useTranslation()

  return (
    <div className={cx('container', isWhite && 'white')}>
      <div className={s.header}>
        <SvgIcon iconName={icon[type]} />
        {t(`sidepanels.assistant_dialog.${type}`)}
      </div>
      <div className={s.message}>{message}</div>
    </div>
  )
}
