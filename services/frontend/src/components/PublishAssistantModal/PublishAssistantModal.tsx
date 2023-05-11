import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useAssistants } from '../../hooks/useAssistants'
import { useObserver } from '../../hooks/useObserver'
import { BotInfoInterface, TDistVisibility } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import s from './PublishAssistantModal.module.scss'

type Visibility = 'public_template' | 'private' | 'unlisted' | null
interface FormValues {
  hide: boolean
  visibility: Visibility
}
export const PublishAssistantModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [bot, setBot] = useState<BotInfoInterface | null>(null)
  const [newValue, setNewValue] = useState<Visibility>()
  const { name: distName } = useParams()
  const isEditor = distName !== undefined && distName.length > 0

  const { register, handleSubmit, reset } = useForm<FormValues>()

  const { changeVisibility } = useAssistants()
  const currentVisibilityStatus = bot?.visibility

  const handleEventUpdate = (data: { detail: any }) => {
    setBot(data?.detail.bot)
    setIsOpen(prev => !prev)
  }

  const handleNoBtnClick = () => closeModal()

  const handlePublish = (data: FormValues) => {
    const visibility = data?.visibility!
    const name = bot?.name!

    visibility !== currentVisibilityStatus ||
    bot?.publish_state == 'in_progress'
      ? toast
          .promise(
            changeVisibility.mutateAsync({
              name,
              visibility,
              inEditor: isEditor,
            }),
            {
              loading: 'Loading...',
              success:
                visibility === 'public_template'
                  ? 'Submitted For Review!'
                  : 'Success!',
              error: 'Something went wrong...',
            }
          )
          .then(() => {
            closeModal()
          })
      : closeModal()
  }

  const closeModal = () => {
    reset({ visibility: null })
    setIsOpen(prev => !prev)
    setBot(() => null)
    setNewValue(() => null)
  }
  useObserver('PublishAssistantModal', handleEventUpdate)
  const visibility = [
    {
      id: 'Private',
      response: 'private',
      description: 'Private (only you can see it)',
    },
    {
      id: 'Unlisted',
      response: 'unlisted',
      description:
        'Unlisted (only those you’ve shared the direct link can see it)',
    },
    {
      id: 'Public',
      response: 'public_template',
      description: 'Public Template (everyone can see it and re-use it)',
    },
  ]

  return (
    <BaseModal isOpen={isOpen} setIsOpen={closeModal}>
      <div className={s.publishAssistantModal}>
        <div className={s.header}>
          <h4>Change who can see your Assistant?</h4>
          <p className={s.annotation}>
            Sharing Assistants with OpenAI models is temporarily disabled. In
            the future, we hope to remove this limitation.
          </p>
        </div>
        <form onSubmit={handleSubmit(handlePublish)} className={s.form}>
          <div className={s.body}>
            <div className={s.radio}>
              {visibility.map((type, id) => {
                return (
                  <RadioButton
                    props={{
                      ...register('visibility'),
                      defaultChecked: type?.response === bot?.visibility,
                      onChange: e => {
                        setNewValue(e?.currentTarget?.value as TDistVisibility)
                      },
                    }}
                    key={id}
                    name={type.response}
                    id={type.id}
                    htmlFor={type.id}
                    value={type.response}
                  >
                    {type.description}
                  </RadioButton>
                )
              })}
            </div>
          </div>
          <div className={s.btns}>
            <Button theme='secondary' props={{ onClick: handleNoBtnClick }}>
              No
            </Button>
            <Button
              theme='primary'
              props={{
                type: 'submit',
                disabled: changeVisibility?.isLoading,
              }}
            >
              {newValue === 'public_template' ? 'Publish' : ' Save'}
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
