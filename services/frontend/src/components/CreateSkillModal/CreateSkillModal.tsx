import React, { useEffect, useState } from 'react'
import { SkillInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './CreateSkillModal.module.scss'

export const CreateSkillModal = () => {
  const [skill, setSkill] = useState<SkillInfoInterface | null>(null)
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
  const handleEventUpdate = (data: { detail: SkillInfoInterface }) => {
    setSkill(data.detail)
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

  const handleEnterBtnClick = () => {
    if (!isHaveNameAndDesc) return
    location.pathname = '/editor'
  }

  useEffect(() => {
    subscribe('CreateSkillModal', handleEventUpdate)

    return () => unsubscribe('CreateSkillModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.createSkillModal}>
        <h4>Create Skill</h4>

        <Input
          label={
            <div>
              You are using{' '}
              <span className={s.createSkillModal__mark}>{skill?.name}</span>{' '}
              distribution
            </div>
          }
          props={{
            placeholder: 'Enter name of your skill',
          }}
          onChange={handleNameChange}
        />

        <TextArea
          label='Description'
          about='Enter no more than 500 signs'
          props={{ placeholder: 'Enter description for your skill' }}
          onChange={handleDescChange}
        />
        <div className={s.createSkillModal__btns}>
          <Button theme='secondary' props={{ onClick: closeModal }}>
            Cancel
          </Button>
          <Button
            theme='primary'
            props={{
              disabled: !isHaveNameAndDesc,
              onClick: handleEnterBtnClick,
            }}>
            Enter
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
