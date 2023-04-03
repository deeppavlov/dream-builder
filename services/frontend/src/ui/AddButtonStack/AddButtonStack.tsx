import classNames from 'classnames/bind'
import { ReactComponent as PlusLogo } from '../../assets/icons/plus.svg'
import s from './AddButtonStack.module.scss'

interface AddButtonStackProps {
  onClick?: () => void
  text: string
  disabled: boolean
}

export const AddButtonStack = ({
  onClick,
  text,
  disabled,
}: AddButtonStackProps) => {
  const cx = classNames.bind(s)
  return (
    <button
      className={cx('add', disabled && 'disabled')}
      disabled={disabled}
      onClick={onClick}
    >
      <PlusLogo />
      <p>{text}</p>
    </button>
  )
}
