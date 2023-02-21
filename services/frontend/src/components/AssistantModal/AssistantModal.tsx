import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useQueryClient, useMutation } from 'react-query'
import { postAssistantDist } from '../../services/postAssistanDist'
import { renameAssistantDist } from '../../services/renameAssistantDist'
import { subscribe, unsubscribe } from '../../utils/events'
import { BotInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import s from './AssistantModal.module.scss'
import { cloneAssistantDist } from '../../services/cloneAssistantDist'

type TAssistantModalAction = 'clone' | 'create' | 'edit'
type FormValues = { display_name: string; description: string }
interface IAssistantInfo
  extends Pick<BotInfoInterface, 'routingName' | 'name' | 'desc'> {}

interface IAssistantDistInfo
  extends Pick<BotInfoInterface, 'routingName' | 'name'> {}

interface IAssistantModal {
  action: TAssistantModalAction
  bot?: Partial<IAssistantInfo>
  distribution?: IAssistantDistInfo // The assistant that we clone
}

export const AssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAssistantModalAction | null>(null)
  const [bot, setBot] = useState<Partial<IAssistantInfo> | null>(null)
  const [botDist, setBotDist] = useState<IAssistantDistInfo | null>(null)
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: 'all' })
  const [NAME_ID, DESC_ID] = ['display_name', 'description']
  const name = bot?.routingName!
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setBot(null)
    setBotDist(null)
  }

  const handleEventUpdate = (data: { detail: IAssistantModal | null }) => {
    setAction(data.detail?.action ?? 'create') // Set 'create' action as default
    setBot(data.detail?.bot ?? null)
    setBotDist(data.detail?.distribution ?? null)
    // Reset values and errors states
    reset({
      [NAME_ID]: data?.detail?.bot?.name,
      [DESC_ID]: data?.detail?.bot?.desc,
    })
    setIsOpen(!isOpen)
  }

  const handleCreateBtnClick = () => {
    handleSubmit(onFormSubmit)
  }

  const handleCloneBtnClick = () => {
    handleSubmit(onFormSubmit)
  }

  const handleSaveBtnClick = () => {
    async function submit() {
      const succeed = await handleSubmit(onFormSubmit)()
      return succeed
    }
    if (!isValid) return
    submit().then(() => {
      closeModal()
    })
  }
  const rename = useMutation({
    mutationFn: (variables: { data: FormValues; name: string }) => {
      return renameAssistantDist(variables.name, variables.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'usersAssistantDists' })
    },
  })
  const clone = useMutation({
    mutationFn: (variables: { data: FormValues; name: string }) => {
      return cloneAssistantDist(variables.data, variables.name)
    },
    onSuccess: data => {
      queryClient
        .invalidateQueries({ queryKey: 'usersAssistantDists' })
        .then(() => {
          navigate(`/${data?.name}`, {
            state: { preview: false, distName: data?.name },
          })
        })
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      return postAssistantDist(data)
    },
    onSuccess: data => {
      queryClient
        .invalidateQueries({ queryKey: 'usersAssistantDists' })
        .then(() => {
          navigate(`/${data?.name}`, {
            state: { preview: false, distName: data?.name },
          })
        })
    },
  })

  const onFormSubmit: SubmitHandler<FormValues> = data => {
    action === 'create' && mutation.mutate(data)
    action === 'clone' && clone.mutate({ data, name })
    action === 'edit' && rename.mutate({ data, name })
  }

  useEffect(() => {
    subscribe('AssistantModal', handleEventUpdate)
    return () => unsubscribe('AssistantModal', handleEventUpdate)
  }, [])
  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={closeModal}>
      <div className={s.assistantModal}>
        <div>
          {action === 'create' && <h4>Create a new virtual assistant</h4>}
          {action === 'clone' && <h4>Create clone of a virtual assistant</h4>}
          {action === 'edit' && <h4>Edit virtual assistant</h4>}
          <div className={s.distribution}>
            {action === 'clone' && (
              <div>
                You are creating a copy of a <mark>{botDist?.name}</mark>{' '}
                distribution
              </div>
            )}
            {action === 'create' && (
              <div>
                You are creating a new distribution from <mark>scratch</mark>
              </div>
            )}
            {action === 'edit' && (
              <div>
                You are editing <mark>{bot?.name}</mark> distribution
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Input
            label='Name'
            error={errors[NAME_ID as keyof FormValues]}
            props={{
              placeholder: 'Enter name for your VA',
              value: getValues()[NAME_ID as keyof FormValues],
              ...register(NAME_ID as keyof FormValues, {
                required: 'Please add name for your Virtual Assistant',
              }),
            }}
          />
          <TextArea
            label='Description'
            withCounter
            error={errors[DESC_ID as keyof FormValues]}
            about={
              <div className={s.textMuted}>
                You will be able to edit this information later.
              </div>
            }
            props={{
              placeholder: 'Enter description for your VA',
              value: getValues()[DESC_ID as keyof FormValues],
              ...register(DESC_ID as keyof FormValues, {
                required: 'Please add description for your Virtual Assistant.',
                maxLength: {
                  value: 500,
                  message: 'You’ve reached limit of the signs.',
                },
              }),
            }}
          />
          <div className={s.btns}>
            <Button theme='secondary' props={{ onClick: closeModal }}>
              Cancel
            </Button>
            <Button
              theme='primary'
              props={{
                type: 'submit',
                onClick: () => {
                  if (action == 'create') handleCreateBtnClick()
                  if (action == 'clone') handleCloneBtnClick()
                  if (action == 'edit') handleSaveBtnClick()
                },
              }}>
              {action === 'create' && 'Create'}
              {action === 'clone' && 'Clone'}
              {action === 'edit' && 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}
