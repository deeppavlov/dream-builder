import { ReactComponent as PlusIcon } from '@assets/icons/plus_icon.svg'
import { ReactComponent as RightIcon } from '@assets/icons/arrow_left_button.svg'
import s from './Button.module.scss'
import classNames from 'classnames/bind'

interface Props extends React.PropsWithChildren {
  theme?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'error' | 'dark'
  small?: boolean
  long?: boolean
  withIcon?: boolean
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

const Button = ({ theme, small, long, withIcon, children, props }: Props) => {
  const cx = classNames.bind(s)
  return (
    <button
      className={cx(
        'button',
        theme && `button_theme_${theme}`,
        small && `button_theme_${theme}_small`,
        small && 'button_small',
        long && 'button_long',
        withIcon && 'button_with-icon'
      )}
      {...props}>
      {theme === 'tertiary' && <PlusIcon className={s.button__icon} />}
      {theme === 'ghost' && <RightIcon className={s.button__icon} />}
      {children}
    </button>
  )
}

export default Button
