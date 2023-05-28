import { ButtonHTMLAttributes } from 'react'
import { ReactComponent as EditPencilIcon } from 'assets/icons/edit_pencil.svg'
import s from './EditPencilButton.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const EditPencilButton = (props: Props) => {
  return (
    <button className={s.edit} {...props}>
      <EditPencilIcon className={s.icon} />
    </button>
  )
}

export default EditPencilButton
