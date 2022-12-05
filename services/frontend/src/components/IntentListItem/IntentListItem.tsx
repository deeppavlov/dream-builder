import { ReactComponent as EditIcon } from '@assets/icons/edit_pencil.svg'
import { useState } from 'react'
import IntentModal from '../IntentModal/IntentModal'
import s from './IntentListItem.module.scss'

export interface IntentListItemProps {
  name: string
  similar: string
  status?: 'good' | 'warning' | 'error'
}

const IntentListItem = ({ name, similar, status }: IntentListItemProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const handleEditButtonClick = () => setModalIsOpen(true)

  return (
    <li
      className={`${s.intentListItem} ${
        status && s[`intentListItem_status_${status}`]
      }`}>
      <div>
        <span className={s.intentListItem__name}>{name}</span>
        <p className={s.intentListItem__similar}>{similar}</p>
      </div>
      <button className={s.intentListItem__edit} onClick={handleEditButtonClick}>
        <EditIcon />
      </button>
      {/* Need to send info about intent to modal */}
      <IntentModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />
    </li>
  )
}

export default IntentListItem
