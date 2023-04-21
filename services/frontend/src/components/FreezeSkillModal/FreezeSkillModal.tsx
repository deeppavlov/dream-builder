import { useState } from 'react'
import { useObserver } from '../../hooks/useObserver'
import { ISkill } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import s from './FreezeSkillModal.module.scss'

export const FreezeSkillModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [skill, setSkill] = useState<ISkill>()
  const handleEventUpdate = ({ detail }) => {
    setSkill(detail)
    setIsOpen(!isOpen)
    return skill
  }

  const handleCancelClick = () => setIsOpen(false)

  const handleDisableClick = () => setIsOpen(false)

  useObserver('FreezeSkillModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.areYouSure}>
        <div className={s.header}>
          Do You Want to disable <mark> {skill?.display_name} </mark>
          Skill?
          <br />
        </div>
        <span>
          If you disable it, this skill will stop working in your Virtual
          Assistant. You can enable it in any time
        </span>
        <div className={s.footer}>
          <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            Cancel
          </Button>
          <Button theme='primary' props={{ onClick: handleDisableClick }}>
            Disable
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
