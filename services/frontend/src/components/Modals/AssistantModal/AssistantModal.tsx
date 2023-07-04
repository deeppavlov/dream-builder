import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { AssistantFormValues, BotInfoInterface } from 'types/types'
import { toasts } from 'mapping/toasts'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { useOnKey } from 'hooks/useOnKey'
import { trigger } from 'utils/events'
import { getValidationSchema } from 'utils/getValidationSchema'
import { Button } from 'components/Buttons'
import { Input, TextArea } from 'components/Inputs'
import { BaseModal } from 'components/Modals'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
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
  const { t } = useTranslation('translation', { keyPrefix: 'modals.assistant' })
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAssistantModalAction | null>(null)
  const [bot, setBot] = useState<Partial<IAssistantInfo> | null>(null)
  const isEditing = action === 'edit'
  const isCloning = action === 'clone'
  const isCreateFromScratch = action === 'create'
  const validationSchema = getValidationSchema()

  const { handleSubmit, control, reset } = useForm<AssistantFormValues>({
    mode: 'all',
  })

  const { create, rename, clone } = useAssistants()
  const [NAME_ID, DESC_ID] = ['display_name', 'description']

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setBot(null)
    if (!isEditing) trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
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
    switch (action) {
      case 'create':
        toast.promise(create.mutateAsync(data), toasts.createAssistant)
        break
      case 'clone':
        toast.promise(
          clone.mutateAsync({ data, name }, { onSuccess: closeModal }),
          toasts.cloneAssistant
        )
        break
      case 'edit':
        toast.promise(
          rename.mutateAsync({ data, name }, { onSuccess: closeModal }),
          toasts.renameAssistant
        )
        break
      default:
        break
    }
  }

  useOnKey(handleSubmit(onFormSubmit), 'Enter') //FIX

  useObserver('AssistantModal', handleEventUpdate)

  return (
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleClose={closeModal}
      onRequestClose={closeModal}
    >
      <form className={s.assistantModal} onSubmit={handleSubmit(onFormSubmit)}>
        <div className={s.header}>
          <h4>
            {isCloning && t('clone.header')}
            {isEditing && t('edit.header')}
            {isCreateFromScratch && t('create_from_scratch.header')}
          </h4>
          {!isCreateFromScratch && <mark>{bot?.display_name}</mark>}
          <div className={s.distribution}>
            {isEditing ? t('edit.subheader') : t('subheader')}
          </div>
        </div>
        <Input
          label={t('name_field.label')}
          name={NAME_ID}
          control={control}
          rules={{
            required: validationSchema.global.required,
            pattern: validationSchema.global.regExpPattern,
          }}
          props={{
            placeholder: t('name_field.placeholder'),
          }}
        />
        <div className={s.textarea}>
          <TextArea
            label={t('desc_field.label')}
            name={DESC_ID}
            control={control}
            withCounter
            rules={{
              required: validationSchema.global.required,
              maxLength: validationSchema.global.desc.maxLength(1000),
              pattern: validationSchema.global.regExpPattern,
            }}
            props={{
              placeholder: t('desc_field.placeholder'),
              rows: 6,
            }}
          />
        </div>

        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: closeModal }}>
            {t('btns.cancel')}
          </Button>
          {action === 'create' && (
            <Button
              theme='primary'
              props={{ type: 'submit', disabled: create?.isLoading }}
            >
              {t('btns.create')}
            </Button>
          )}
          {action === 'clone' && (
            <Button
              theme='primary'
              props={{ type: 'submit', disabled: clone?.isLoading }}
            >
              {t('btns.create')}
            </Button>
          )}
          {action === 'edit' && (
            <Button
              theme='primary'
              props={{ type: 'submit', disabled: rename?.isLoading }}
            >
              {t('btns.save')}
            </Button>
          )}
        </div>
      </form>
    </BaseModal>
  )
}
