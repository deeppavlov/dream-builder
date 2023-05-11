import { useState } from 'react'
import toast from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { useAssistants } from '../../hooks/useAssistants'
import { useComponent } from '../../hooks/useComponent'
import { useDeploy } from '../../hooks/useDeploy'
import { useObserver } from '../../hooks/useObserver'
import { toasts } from '../../mapping/toasts'
import { ISkill } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import s from './DeleteSkillModal.module.scss'

export const DeleteSkillModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { name: distName } = useParams()
  const [skill, setSkill] = useState<ISkill>()
  const { deleteComponent } = useComponent()
  const { deleteDeployment } = useDeploy()
  const queryClient = useQueryClient()
  const { getDist } = useAssistants()
  const assistant = getDist(distName!)

  const handleEventUpdate = ({ detail }: any) => {
    setSkill(detail?.skill)
    setIsOpen(prev => !prev)
  }
  const deleteSkill = async () => {
    if (!skill?.id) return
    const assistantId = assistant?.data?.deployment?.id!

    await toast.promise(
      deleteComponent.mutateAsync(
        {
          distName: distName || '',
          id: skill.id,
          component_id: skill.component_id,
          type: 'skills',
        },
        {
          onSuccess: () => {
            assistant?.data?.deployment?.state === 'UP' &&
              deleteDeployment.mutateAsync(assistantId).then(() => {
                queryClient.invalidateQueries('dist')
              })
          },
        }
      ),
      toasts.deleteComponent
    )
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
          <h4>Do you really want to delete skill:</h4>
          <mark>{skill?.display_name}</mark>
          <div className={s.desc}>This action can’t be undone</div>
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
