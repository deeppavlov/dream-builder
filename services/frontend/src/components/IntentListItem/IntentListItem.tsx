import { ReactComponent as EditIcon } from '@assets/icons/edit_pencil.svg'
import { useState } from 'react'
import IntentCatcherModal from '../IntentCatcherModal/IntentCatcherModal'
import s from './IntentListItem.module.scss'

export interface IntentListItemInterface {
  id: string
  name: string
  about?: string
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
}

const IntentListItem = ({
  name,
  about,
  status,
  disabled,
}: IntentListItemInterface) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const handleEditButtonClick = () => setModalIsOpen(true)

  return (
    <div
      className={`${s.intentListItem} ${
        status ? s.intentListItem_status : ''
      } ${status ? s[`intentListItem_status_${status}`] : ''}`}
      data-disabled={disabled}>
      <div className={s.intentListItem__container}>
        <span className={s.intentListItem__name}>{name}</span>
        <p className={s.intentListItem__about}>{about}</p>
      </div>
      <button
        className={s.intentListItem__edit}
        onClick={handleEditButtonClick}
        disabled={disabled}>
        <EditIcon />
      </button>
      {/* Need to send info about intent to modal */}
      <IntentCatcherModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />
    </div>
  )
}

export default IntentListItem
