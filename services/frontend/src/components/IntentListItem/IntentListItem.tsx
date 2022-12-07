import { ReactComponent as EditIcon } from '@assets/icons/edit_pencil.svg'
import { useState } from 'react'
import IntentModal from '../IntentModal/IntentModal'
import s from './IntentListItem.module.scss'

export interface IntentListItemProps {
  name: string
  similar: string
  status?: 'success' | 'warning' | 'error'
  disabled?: boolean
}

const IntentListItem = ({
  name,
  similar,
  status,
  disabled,
}: IntentListItemProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const handleEditButtonClick = () => setModalIsOpen(true)

  return (
    <div
      className={`${s.intentListItem} ${
        status ? s[`intentListItem_status_${status}`] : ''
      }`}
      data-disabled={disabled}>
      <div className={s.intentListItem__container}>
        <span className={s.intentListItem__name}>{name}</span>
        <p className={s.intentListItem__similar}>{similar}</p>
      </div>
      <button
        className={s.intentListItem__edit}
        onClick={handleEditButtonClick}
        disabled={disabled}>
        <EditIcon />
      </button>
      {/* Need to send info about intent to modal */}
      <IntentModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />
    </div>
  )
}

export default IntentListItem
