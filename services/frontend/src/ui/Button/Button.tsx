import { ReactComponent as PlusIcon } from '@assets/icons/plus_icon.svg'
import { ReactComponent as RightIcon } from '@assets/icons/arrow_left_button.svg'
import s from './Button.module.scss'

interface Props extends React.PropsWithChildren {
  theme: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'error'
  small?: boolean
  long?: boolean
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

const Button = ({ theme, small, long, children, props }: Props) => {
  return (
    <button
      className={`${s.button} ${s[`button_theme_${theme}`]} ${
        small && s[`button_theme_${theme}_small`]
      } ${small && s.button_small} ${long && s.button_long}`}
      {...props}>
      {theme === 'tertiary' && <PlusIcon className={s.button__icon} />}
      {theme === 'ghost' && <RightIcon className={s.button__icon} />}
      {children}
    </button>
  )
}

export default Button
