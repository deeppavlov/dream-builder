import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAssistants } from '../../hooks/useAssistants'
import { useObserver } from '../../hooks/useObserver'
import { useOnKey } from '../../hooks/useOnKey'
import { AssistantFormValues, BotInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { validationSchema } from '../../utils/validationSchema'
import s from './AssistantModal.module.scss'

type TAssistantModalAction = 'clone' | 'create' | 'edit'

interface IAssistantInfo
  extends Pick<BotInfoInterface, 'name' | 'display_name' | 'description'> {}

interface IAssistantDistInfo
  extends Pick<BotInfoInterface, 'name' | 'display_name'> {}

interface IAssistantModal {
  action: TAssistantModalAction
  bot?: Partial<IAssistantInfo>
  distribution?: IAssistantDistInfo // The assistant that we clone
}

export const AssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAssistantModalAction | null>(null)
  const [bot, setBot] = useState<Partial<IAssistantInfo> | null>(null)
  const isEditing = action === 'edit'
  const isCloning = action === 'clone'
  const isCreateFromScratch = action === 'create'

  const { handleSubmit, control, reset, getValues } =
    useForm<AssistantFormValues>({ mode: 'all' })

  const { create, rename, clone } = useAssistants()
  const [NAME_ID, DESC_ID] = ['display_name', 'description']

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setBot(null)
  }

  const handleEventUpdate = (data: { detail: IAssistantModal | null }) => {
    setAction(data.detail?.action ?? 'create') // Set 'create' action as default
    setBot(data.detail?.bot ?? null)

    reset({
      [NAME_ID]: data?.detail?.bot?.display_name,
      [DESC_ID]: data?.detail?.bot?.description,
    })
    setIsOpen(prev => !prev)
  }

  const name = bot?.name!

  const onFormSubmit: SubmitHandler<AssistantFormValues> = data => {
    action === 'create' &&
      toast.promise(create.mutateAsync(data), {
        loading: 'Creating...',
        success: 'Success!',
        error: 'Something went wrong...',
      })
    action === 'clone' &&
      toast
        .promise(clone.mutateAsync({ data, name }), {
          loading: 'Cloning...',
          success: 'Success!',
          error: 'Something went wrong...',
        })
        .then(() => {
          closeModal()
        })
    action === 'edit' &&
      toast
        .promise(rename.mutateAsync({ data, name }), {
          loading: 'Renaming...',
          success: 'Success!',
          error: 'Something went wrong...',
        })
        .then(() => {
          closeModal()
        })
  }

  useOnKey(handleSubmit(onFormSubmit), 'Enter')

  useObserver('AssistantModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={closeModal}>
      <form className={s.assistantModal} onSubmit={handleSubmit(onFormSubmit)}>
        <div className={s.header}>
          <h4>
            {isCloning && 'Create new assistant from:'}
            {isEditing && 'Edit assistant:'}
            {isCreateFromScratch && 'Create new assistant from scratch'}
          </h4>
          {!isCreateFromScratch && (
            <mark>
              {isEditing || isCloning ? `${bot?.display_name}` : 'Scratch'}
            </mark>
          )}
          <div className={s.distribution}>
            {`${
              isEditing ? 'Change' : 'Enter'
            } name and description for your assistant`}
          </div>
        </div>
        <Input
          label='Name'
          name={NAME_ID}
          defaultValue={getValues().display_name}
          control={control}
          rules={{
            required: validationSchema.global.required,
            pattern: validationSchema.global.regExpPattern,
          }}
          props={{
            placeholder: 'A short name describing your Virtual Assistant',
          }}
        />
        <div className={s.textarea}>
          <TextArea
            name={DESC_ID}
            control={control}
            defaultValue={getValues().description}
            label='Description'
            withCounter
            rules={{
              required: validationSchema.global.required,
              maxLength: validationSchema.global.desc.maxLength(1000),
              pattern: validationSchema.global.regExpPattern,
            }}
            props={{
              placeholder:
                'Describe your Virtual Assistant ability, where you can use it and for what purpose',
              rows: 6,
            }}
          />
        </div>

        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: closeModal }}>
            Cancel
          </Button>
          {action === 'create' && (
            <Button
              theme='primary'
              props={{ type: 'submit', disabled: create?.isLoading }}
            >
              Create
            </Button>
          )}
          {action === 'clone' && (
            <Button
              theme='primary'
              props={{ type: 'submit', disabled: clone?.isLoading }}
            >
              Use
            </Button>
          )}
          {action === 'edit' && (
            <Button
              theme='primary'
              props={{ type: 'submit', disabled: rename?.isLoading }}
            >
              Save
            </Button>
          )}
        </div>
      </form>
    </BaseModal>
  )
}
