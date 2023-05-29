import { useState } from 'react'
import toast from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { BotInfoInterface } from 'types/types'
import { VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { Button } from 'components/Buttons'
import { BaseModal } from 'components/Modals'
import s from './DeleteAssistantModal.module.scss'

interface IDeleteAssistantModal {
  bot: BotInfoInterface
}

export const DeleteAssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()
  const [bot, setBot] = useState<BotInfoInterface | null>()
  const { deleteDist } = useAssistants()
  const { name } = useParams()
  const navigate = useNavigate()

  const isEditorRoute = name !== undefined && name.length > 0
  const assistantIsPublic =
    bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE

  const handleClose = () => {
    setBot(null)
    setIsOpen(false)
    if (isEditorRoute) navigate(RoutesList.start)
  }
  const handleEventUpdate = (data: { detail: IDeleteAssistantModal }) => {
    setBot(data.detail.bot ?? null)
    setIsOpen(prev => !prev)
  }

  const handleCancelBtnClick = () => handleClose()

  const handleDeleteBtnClick = () => {
    toast
      .promise(deleteDist.mutateAsync(bot?.name!), toasts.deleteAssistant)
      .then(() => {
        assistantIsPublic && queryClient.invalidateQueries('publicDists')
      })
      .finally(() => handleClose())
  }

  useObserver('DeleteAssistantModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={handleClose}>
      <div className={s.deleteAssistantModal}>
        <h4>
          Do you really want to delete Assistant:
          <br />
          <mark>{bot?.display_name}</mark>
        </h4>
        <span className={s.desc}>
          This action can’t be undone.
          <br />
          {assistantIsPublic &&
            'Your Assistant will be removed for the public templates.'}
        </span>

        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handleCancelBtnClick }}>
            Cancel
          </Button>
          <Button theme='error' props={{ onClick: handleDeleteBtnClick }}>
            Delete
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
