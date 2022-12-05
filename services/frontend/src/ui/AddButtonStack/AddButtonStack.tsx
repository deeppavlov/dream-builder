import { ReactComponent as PlusLogo } from '../../assets/icons/plus.svg'
import s from './AddButtonStack.module.scss'

export const AddButtonStack = ({ onClick, text, disabled }: any) => {
  return (
    <button
      className={s.add_btn}
      style={{
        opacity: disabled && '0.3',
      }}
      disabled={disabled}
      onClick={onClick}>
      <PlusLogo />
      <p>{text}</p>
    </button>
  )
}
