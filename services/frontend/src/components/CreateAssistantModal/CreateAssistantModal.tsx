import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import { BotInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './CreateAssistantModal.module.scss'

export const CreateAssistantModal = () => {
  const [bot, setBot] = useState<BotInfoInterface | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [nameByUser, setNameByUser] = useState<string | null>(null)
  const [descByUser, setDescByUser] = useState<string | null>(null)
  const isHaveNameAndDesc = nameByUser !== null && descByUser !== null

  const closeModal = () => {
    setIsOpen(false)
    setNameByUser(null)
    setDescByUser(null)
  }
  /**
   * Set modal is open and getting bot info
   */
  const handleEventUpdate = (data: { detail: BotInfoInterface }) => {
    setBot(data.detail)
    setIsOpen(!isOpen)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const isValue = value !== ''
    setNameByUser(isValue ? value : null)
  }

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    const isValue = value !== ''
    setDescByUser(isValue ? value : null)
  }

  const handleContinueBtnClick = () => {
    if (!isHaveNameAndDesc) return
    location.pathname = '/editor'
  }

  useEffect(() => {
    subscribe('CreateAssistantModal', handleEventUpdate)

    return () => unsubscribe('CreateAssistantModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.createAssistantModal}>
        <h4>Create a new virtual assistant</h4>

        <Input
          label={
            <div>
              You are using{' '}
              <span className={s.createAssistantModal__mark}>{bot?.name}</span>{' '}
              distribution
            </div>
          }
          props={{
            placeholder: 'Enter name of your bot',
          }}
          onChange={handleNameChange}
        />

        <TextArea
          label='Description'
          about='Enter no more than 500 signs'
          props={{ placeholder: 'Enter description for your VA' }}
          onChange={handleDescChange}
        />
        <div className={s.createAssistantModal__btns}>
          <Button theme='secondary' props={{ onClick: closeModal }}>
            Cancel
          </Button>
          <Button
            theme='primary'
            props={{
              disabled: !isHaveNameAndDesc,
              onClick: handleContinueBtnClick,
            }}>
            Continue
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
