import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import { BotInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './DeleteAssistantModal.module.scss'

interface IDeleteAssistantInfo
  extends Pick<BotInfoInterface, 'routingName' | 'name'> {}

interface IDeleteAssistantModal {
  bot: IDeleteAssistantInfo
}

export const DeleteAssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [bot, setBot] = useState<IDeleteAssistantInfo | null>()
  let cx = classNames.bind(s)

  const handleClose = () => {
    setBot(null)
    setIsOpen(false)
  }

  const handleEventUpdate = (data: { detail: IDeleteAssistantModal }) => {
    setBot(data.detail.bot ?? null)
    setIsOpen(!isOpen)
  }

  const handleCancelBtnClick = () => handleClose()

  const handleDeleteBtnClick = () => {}

  useEffect(() => {
    subscribe('DeleteAssistantModal', handleEventUpdate)
    return () => unsubscribe('DeleteAssistantModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={handleClose}>
      <div className={cx('deleteAssistantModal')}>
        <h4>
          Do you really want to delete <mark>{bot?.name}</mark> Virtual
          Assistant?
        </h4>
        <span className={cx('desc')}>This action can’t be undone</span>
        <div className={cx('btns')}>
          <Button theme='secondary' props={{ onClick: handleCancelBtnClick }}>
            Cancel
          </Button>
          <Button
            theme='error'
            props={{
              onClick: handleDeleteBtnClick,
            }}>
            Delete
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
