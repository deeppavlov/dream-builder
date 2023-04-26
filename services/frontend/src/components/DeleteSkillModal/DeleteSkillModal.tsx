import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { useComponent } from '../../hooks/useComponent'
import { useObserver } from '../../hooks/useObserver'
import { ISkill } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import s from './DeleteSkillModal.module.scss'

export const DeleteSkillModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [skill, setSkill] = useState<ISkill>()
  const { state } = useLocation()
  const { deleteComponent } = useComponent()
  const handleEventUpdate = ({ detail }: any) => {
    setSkill(detail?.skill)
    setIsOpen(!isOpen)
  }
  const deleteSkill = async () => {
    const distName = state?.distName!
    const id = skill?.id!
    await toast.promise(deleteComponent.mutateAsync({ distName, id }), {
      loading: 'Deleting...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })
  }

  const handleCancelClick = () => setIsOpen(false)

  const handleYesClick = () => {
    deleteSkill().then(() => setIsOpen(false))
  }

  useObserver('DeleteSkillModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.areYouSure}>
        <div className={s.header}>
          Do you really want to delete this component:
          <mark> {skill?.display_name} </mark>?
        </div>
        <div className={s.footer}>
          <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            Cancel
          </Button>
          <Button theme='error' props={{ onClick: handleYesClick }}>
            Delete
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
