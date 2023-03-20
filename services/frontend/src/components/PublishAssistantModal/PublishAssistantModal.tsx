import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { BotInfoInterface } from '../../types/types'
import { publishAssistantDist } from '../../services/publishUsersAssistantDist'
import { subscribe, unsubscribe } from '../../utils/events'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import toast from 'react-hot-toast'
import s from './PublishAssistantModal.module.scss'

interface IPublishBot extends Pick<BotInfoInterface, 'name' | 'display_name'> {}
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
      return publishAssistantDist(bot?.name!)
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
          Do you want to publish <mark>{bot?.display_name}</mark> to Virtual
          Assistants Store?
        </h4>
        <p className={s.text}>
          Choose the type of visibility for Virtual Assistant
        </p>
        <div className={s.body}>
          <form className={s.form}>
            <RadioButton
              tooltip='Public'
              name='visibility'
              id='Public'
              htmlFor='Public'
              value='Public'
              defaultChecked={true}>
              Public
            </RadioButton>
            <p className={s.text}>or</p>
            <RadioButton
              tooltip='Unlisted'
              name='visibility'
              id='Unlisted'
              htmlFor='Unlisted'
              value='Unlisted'>
              Unlisted
            </RadioButton>
          </form>
          <div className={s.forCheckbox}>
            <Checkbox
              defaultChecked={true}
              theme='secondary'
              label='Hide your prompt(s) so that others could not see them'
            />
          </div>
        </div>
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
      <BaseToolTip
        id='Public'
        content='Everyone can clone and talk to your VA'
      />
      <BaseToolTip
        id='Unlisted'
        content={`Anyone with this link can talk to your VA.\n\nThis VA won’t appear in Public Store\nunless you adds it to a public category`}
      />
    </BaseModal>
  )
}
