import classNames from 'classnames/bind'
import { ReactComponent as PlusIcon } from 'assets/icons/plus_icon.svg'
import s from './Button.module.scss'

interface Props extends React.PropsWithChildren {
  theme?:
    | 'primary'
    | 'purple'
    | 'secondary'
    | 'secondary-dark'
    | 'secondary-light'
    | 'tertiary'
    | 'tertiary2'
    | 'tertiary-round'
    | 'ghost'
    | 'error'
    | 'stack'
  tiny?: boolean
  small?: boolean
  long?: boolean
  withIcon?: boolean
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>
  clone?: boolean
  loader?: boolean
}

export const Button = ({
  theme,
  tiny,
  small,
  long,
  withIcon,
  children,
  clone,
  props,
  loader,
}: Props) => {
  const cx = classNames.bind(s)
  return (
    <button
      className={cx(
        'button',
        theme && `button_theme_${theme}`,
        small && `button_theme_${theme}_small`,
        loader && 'loader',
        tiny && 'button_tiny',
        small && 'button_small',
        long && 'button_long',
        withIcon && 'button_with-icon',
        clone && 'button_clone'
      )}
      type='button'
      {...props}
    >
      {theme === 'tertiary' && <PlusIcon className={s.button__icon} />}
      {/* {theme === 'ghost' && <RightIcon className={s.button__icon} />} */}
      {children}
    </button>
  )
}

export default Button
