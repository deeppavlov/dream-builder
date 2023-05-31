import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { BotInfoInterface, TDistVisibility, Visibility } from 'types/types'
import { PUBLISH_REQUEST_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import { visibility } from 'mapping/visibility'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { Button, RadioButton } from 'components/Buttons'
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
  const [newValue, setNewValue] = useState<Visibility>()
  const { name: distName } = useParams()
  const isEditor = distName !== undefined && distName.length > 0
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, getValues, watch } =
    useForm<FormValues>()

  const { changeVisibility } = useAssistants()
  const currentVisibility = bot?.visibility

  const handleEventUpdate = (data: { detail: any }) => {
    setBot(data?.detail.bot)
    setIsOpen(prev => !prev)
  }

  const handleNoBtnClick = () => closeModal()

  const handlePublish = (data: FormValues) => {
    const visibility = data?.visibility!
    const name = bot?.name!
    const deploymentState = bot?.deployment?.state

    visibility !== currentVisibility ||
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
                  currentVisibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE &&
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
    reset({ visibility: null })
    setIsOpen(prev => !prev)
    setBot(() => null)
    setNewValue(() => null)
  }
  useObserver('PublishAssistantModal', handleEventUpdate)
  // console.log('store() = ', store('publishAlert'))
  return (
    <BaseModal isOpen={isOpen} setIsOpen={closeModal}>
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
                      ...register('visibility'),
                      defaultChecked: type?.id === bot?.visibility,
                      onChange: e => {
                        setNewValue(e?.currentTarget?.value as TDistVisibility)
                      },
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
            {/* <Checkbox
              theme='secondary'
              name='alertMessage'
              label='Don’t show allert message again'
              props={{
                ...register('publishAlert'),
                defaultChecked: store('publishAlert'),
                onChange: e => {
                  console.log(watch('publishAlert'))
                  store('publishAlert', getValues('publishAlert'))
                },
              }}
            /> */}
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
              {newValue === VISIBILITY_STATUS.PUBLIC_TEMPLATE
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
