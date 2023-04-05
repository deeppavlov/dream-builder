import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useObserver } from '../../hooks/useObserver'
import { publishAssistantDist } from '../../services/publishUsersAssistantDist'
import { BotInfoInterface, BotVisabilityType } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Checkbox } from '../../ui/Checkbox/Checkbox'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import s from './PublishAssistantModal.module.scss'

interface IPublishBot extends Pick<BotInfoInterface, 'name' | 'display_name'> {}
interface IPublishAssistantModal {
  bot: IPublishBot
}
interface FormValues {
  hide: boolean
  visability: BotVisabilityType
}

export const PublishAssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [bot, setBot] = useState<IPublishBot | null>(null)
  const { register, handleSubmit } = useForm<FormValues>()
  const handleEventUpdate = (data: { detail: IPublishAssistantModal }) => {
    setBot(data.detail.bot)
    setIsOpen(!isOpen)
  }

  const handleNoBtnClick = () => setIsOpen(false)

  const handlePublish = (data: FormValues) => {
    const isPromptVisible = !data?.hide
    const isPublic = data?.visability === 'Public'
    const distName = bot?.name!
    toast.promise(
      mutation.mutateAsync({ distName, isPromptVisible, isPublic }),
      {
        loading: 'Loading...',
        success: 'Submitted For Review! ',
        error: 'Something Went Wrong...',
      }
    )

    setIsOpen(false)
  }

  const mutation = useMutation({
    mutationFn: (variables: {
      distName: string
      isPromptVisible: boolean
      isPublic: boolean
    }) => {
      return publishAssistantDist(
        variables.distName,
        variables.isPromptVisible,
        variables.isPublic
      )
    },
  })

  useObserver('PublishAssistantModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.publishAssistantModal}>
        <div className={s.header}>
          <h4>
            Do you want to publish <mark>{bot?.display_name}</mark> to Virtual
            Assistants Store?
          </h4>
          <p className={s.text}>
            Choose the type of visibility for Virtual Assistant
          </p>
        </div>
        <form onSubmit={handleSubmit(handlePublish)} className={s.form}>
          <div className={s.body}>
            <div className={s.radio}>
              <RadioButton
                props={{ ...register('visability') }}
                tooltipId='Public'
                name='visibility'
                id='Public'
                htmlFor='Public'
                value='Public'
                defaultChecked={true}
              >
                Public
              </RadioButton>
              <p className={s.text}>or</p>
              <RadioButton
                props={{ ...register('visability') }}
                tooltipId='Unlisted'
                name='visibility'
                id='Unlisted'
                htmlFor='Unlisted'
                value='Unlisted'
              >
                Unlisted
              </RadioButton>
            </div>
            <div className={s.forCheckbox}>
              <Checkbox
                props={{ ...register('hide') }}
                defaultChecked={true}
                theme='secondary'
                label='Hide your prompt(s) so that others could not see them'
              />
            </div>
          </div>
          <div className={s.btns}>
            <Button theme='secondary-light' props={{ onClick: handleNoBtnClick }}>
              No
            </Button>
            <Button
              theme='primary'
              props={{
                type: 'submit',
              }}
            >
              Publish
            </Button>
          </div>
        </form>
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
