import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { BotInfoInterface } from '../../types/types'
import { publishAssistantDist } from '../../services/publishUsersAssistantDist'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import s from './PublishAssistantModal.module.scss'
import toast from 'react-hot-toast'

interface IPublishBot extends Pick<BotInfoInterface, 'routingName' | 'name'> {}
interface IPublishAssistantModal {
  bot: IPublishBot
}

export const PublishAssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [bot, setBot] = useState<IPublishBot | null>(null)
  const queryClient = useQueryClient()
  const handleEventUpdate = (data: { detail: IPublishAssistantModal }) => {
    setBot(data.detail.bot)
    setIsOpen(!isOpen)
  }

  const handleNoBtnClick = () => setIsOpen(false)

  const handlePublishBtnClick = () => {
    toast.promise(mutation.mutateAsync(), {
      loading: 'Publishing...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })

    mutation.mutate()
    setIsOpen(false)
  }

  const mutation = useMutation({
    mutationFn: () => {
      return publishAssistantDist(bot?.routingName!)
    },
    // onSuccess: () =>
    //   queryClient
    //     .invalidateQueries({ queryKey: 'assistant_dists' })
    //     .then(() => {
    //       setIsOpen(false)
    //       trigger('Modal', {})
    //     }),
  })

  useEffect(() => {
    subscribe('PublishAssistantModal', handleEventUpdate)
    return () => unsubscribe('PublishAssistantModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.publishAssistantModal}>
        <h4>
          Do you want to publish <mark>{bot?.name}</mark> to Virtual Assistants
          Store?
        </h4>
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handleNoBtnClick }}>
            No
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: handlePublishBtnClick,
            }}>
            Publish
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
