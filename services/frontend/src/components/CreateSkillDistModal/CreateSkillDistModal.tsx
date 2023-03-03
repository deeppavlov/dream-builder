import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { SkillInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import { AssistantModal } from '../AssistantModal/AssistantModal'
import s from './CreateSkillDistModal.module.scss'

const CreateSkillDistModal = () => {
  let cx = classNames.bind(s)
  const [isOpen, setIsOpen] = useState(false)
  const [skill, setSkill] = useState<SkillInfoInterface | null>(null)

  const closeModal = () => {
    setIsOpen(false)
    setSkill(null)
  }

  const handleNewBotBtnClick = () => {
    closeModal()
    trigger('AssistantModal', { action: 'create' })
  }

  const handleExistingBotBtnClick = () => {
    closeModal()
    trigger('ChooseBotModal', skill)
  }

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = (data: { detail: SkillInfoInterface }) => {
    const { detail } = data
    setSkill(detail?.name ? detail : null)
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    subscribe('CreateSkillDistModal', handleEventUpdate)
    return () => unsubscribe('CreateSkillDistModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={cx('createSkillDistModal')}>
        <h4>
          Do you want to <mark>create a new bot</mark> with this skill or{' '}
          <mark>add to one of the existing bots</mark>?
        </h4>
        <div className={cx('btns')}>
          <Button theme='secondary' props={{ onClick: handleNewBotBtnClick }}>
            Create new bot
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: handleExistingBotBtnClick,
            }}>
            Add to existing bot
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}

export default CreateSkillDistModal
