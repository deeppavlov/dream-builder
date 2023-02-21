import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { deleteAssistantDist } from '../../services/deleteAssistantDist'
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
  const queryClient = useQueryClient()
  const deleteDist = useMutation({
    mutationFn: name => {
      return deleteAssistantDist(name)
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: 'usersAssistantDists',
      }),
  })
  const handleClose = () => {
    setBot(null)
    setIsOpen(false)
  }

  const handleEventUpdate = (data: { detail: IDeleteAssistantModal }) => {
    setBot(data.detail.bot ?? null)
    setIsOpen(!isOpen)
  }

  const handleCancelBtnClick = () => handleClose()

  const handleDeleteBtnClick = () => {
    deleteDist.mutate(bot?.routingName)
    handleClose()
  }

  useEffect(() => {
    subscribe('DeleteAssistantModal', handleEventUpdate)
    return () => unsubscribe('DeleteAssistantModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={handleClose}>
      <div className={s.deleteAssistantModal}>
        <h4>
          Do you really want to delete <mark>{bot?.name}</mark> Virtual
          Assistant?
        </h4>

        <span className={s.desc}>This action can’t be undone</span>

        <div className={s.btns}>
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
