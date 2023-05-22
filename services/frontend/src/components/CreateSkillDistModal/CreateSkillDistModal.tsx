import classNames from 'classnames/bind'
import { useState } from 'react'
import { useObserver } from '../../hooks/useObserver'
import { ISkill } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { trigger } from '../../utils/events'
import s from './CreateSkillDistModal.module.scss'

const CreateSkillDistModal = () => {
  let cx = classNames.bind(s)
  const [isOpen, setIsOpen] = useState(false)
  const [skill, setSkill] = useState<ISkill | null>(null)

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
  const handleEventUpdate = (data: { detail: ISkill }) => {
    const { detail } = data
    setSkill(detail?.name ? detail : null)
    setIsOpen(prev => !prev)
  }

  useObserver('CreateSkillDistModal', handleEventUpdate)

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
            }}
          >
            Add to existing bot
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}

export default CreateSkillDistModal
