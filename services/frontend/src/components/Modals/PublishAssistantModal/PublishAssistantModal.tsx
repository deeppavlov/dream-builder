import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import store from 'store2'
import { BotInfoInterface, Visibility } from 'types/types'
import { PUBLISH_REQUEST_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import { visibility } from 'mapping/visibility'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { trigger } from 'utils/events'
import { Button, Checkbox, RadioButton } from 'components/Buttons'
import { BaseToolTip } from 'components/Menus'
import { BaseModal } from 'components/Modals'
import s from './PublishAssistantModal.module.scss'

interface FormValues {
  publishAlert: boolean
  visibility: Visibility
}
export const PublishAssistantModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [bot, setBot] = useState<BotInfoInterface | null>(null)
  const isPushAlert = store('publishAlert')
  const { name: distName } = useParams()
  const isEditor = distName !== undefined && distName.length > 0
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        visibility: bot?.visibility,
        publishAlert: isPushAlert,
      },
    })
  const selectedVisibility = watch('visibility')
  const { changeVisibility } = useAssistants()
  const assistantVisibility = bot?.visibility

  const handleEventUpdate = (data: { detail: any }) => {
    setBot(data?.detail.bot)
    setIsOpen(prev => !prev)
  }

  const handleNoBtnClick = () => closeModal()

  const handlePublish = (data: FormValues) => {
    const visibility = data?.visibility!
    const name = bot?.name!
    const deploymentState = bot?.deployment?.state

    console.log(store('publishAlert'))
    console.log('visibility = ', visibility)

    store('publishAlert', data.publishAlert)

    if (visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE) {
      trigger('PublishWarningModal', { bot })
    }
    visibility !== assistantVisibility ||
    visibility !== VISIBILITY_STATUS.PUBLIC_TEMPLATE ||
    bot?.publish_state == PUBLISH_REQUEST_STATUS.IN_REVIEW
      ? toast
          .promise(
            changeVisibility.mutateAsync(
              {
                name,
                visibility,
                inEditor: isEditor,
                deploymentState,
              },
              {
                onSuccess: () => {
                  assistantVisibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE &&
                    queryClient.invalidateQueries('publicDists')
                },
              }
            ),
            {
              loading: 'Loading...',
              success:
                visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
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
    reset()
    setIsOpen(false)
    setBot(null)
  }

  useEffect(() => {
    const isVisibility = bot?.visibility !== undefined

    if (isVisibility) setValue('visibility', bot?.visibility)
    setValue('publishAlert', isPushAlert)
  }, [bot?.visibility, isPushAlert])

  useObserver('PublishAssistantModal', handleEventUpdate)
  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={closeModal}>
      <div className={s.publishAssistantModal}>
        <div className={s.header}>
          <h4>Change who can see your Assistant?</h4>
        </div>
        <form onSubmit={handleSubmit(handlePublish)} className={s.form}>
          <div className={s.body}>
            <div className={s.radio}>
              {visibility.map((type, i) => {
                return (
                  <RadioButton
                    props={{
                      ...register('visibility', { required: true }),
                    }}
                    key={i}
                    name={type.id}
                    id={type.name}
                    htmlFor={type.name}
                    value={type.id}
                  >
                    {type.description}
                  </RadioButton>
                )
              })}
            </div>
            <Checkbox
              theme='secondary'
              name='alertMessage'
              label='Don’t show alert message again'
              props={{ ...register('publishAlert') }}
            />
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
              {selectedVisibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
                ? 'Publish'
                : ' Save'}
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
