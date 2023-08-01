import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { BotInfoInterface, ELOCALES_KEY, TLang } from 'types/types'
import { language } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { useOnKey } from 'hooks/useOnKey'
import { trigger } from 'utils/events'
import { currentLocale } from 'utils/getLangFromStorage'
import { getValidationSchema } from 'utils/getValidationSchema'
import { Button } from 'components/Buttons'
import { SkillDropboxSearch } from 'components/Dropdowns'
import { Input, TextArea } from 'components/Inputs'
import { BaseModal } from 'components/Modals'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import s from './AssistantModal.module.scss'

type TAssistantModalAction = 'clone' | 'create' | 'edit'

interface IAssistantInfo
  extends Pick<
    BotInfoInterface,
    'name' | 'display_name' | 'description' | 'language'
  > {}

interface IAssistantDistInfo
  extends Pick<BotInfoInterface, 'name' | 'display_name'> {}

interface IAssistantModal {
  action: TAssistantModalAction
  bot?: Partial<IAssistantInfo>
  distribution?: IAssistantDistInfo // The assistant that we clone
}
export type AssistantFormValues = {
  display_name: string
  description: string
  language: { id: ELOCALES_KEY; name: ELOCALES_KEY; display_name: TLang }
}

export const AssistantModal = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [action, setAction] = useState<TAssistantModalAction | null>(null)
  const [bot, setBot] = useState<Partial<IAssistantInfo> | null>(null)

  const isEditing = action === 'edit'
  const isCloning = action === 'clone'
  const isCreateFromScratch = action === 'create'
  const validationSchema = getValidationSchema()
  const locale = currentLocale()
  const currentLanguage = language()[locale] as TLang

  const defaultLangValue = {
    id: locale,
    name: locale,
    display_name: currentLanguage,
  }

  const { handleSubmit, control, reset, setValue } =
    useForm<AssistantFormValues>({
      mode: 'all',
    })

  const { create, rename, clone } = useAssistants()
  const [NAME_ID, DESC_ID, LANGUAGE] = [
    'display_name',
    'description',
    'language',
  ] as const

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setBot(null)

    if (!isEditing) trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }

  const handleEventUpdate = (data: { detail: IAssistantModal | null }) => {
    setAction(data.detail?.action ?? 'create') // Set 'create' action as default
    setBot(data.detail?.bot ?? null)

    const isCreate = data.detail?.action === 'create'
    const assistantLang = data?.detail?.bot?.language?.value! as ELOCALES_KEY
    const assistantLangDisplayName = language()[assistantLang] as TLang
    const assistantLangValue = {
      id: assistantLang!,
      name: assistantLang!,
      display_name: assistantLangDisplayName,
    }

    reset({
      [NAME_ID]: data?.detail?.bot?.display_name,
      [DESC_ID]: data?.detail?.bot?.description,
      [LANGUAGE]: isCreate ? defaultLangValue : assistantLangValue,
    })
    setIsOpen(prev => !prev)
  }

  const name = bot?.name!

  const onFormSubmit: SubmitHandler<AssistantFormValues> = formValues => {
    const language = formValues.language.id as ELOCALES_KEY
    const display_name = formValues.display_name
    const description = formValues.description

    const data = { display_name, description }
    const createPayload = { display_name, description, language }

    switch (action) {
      case 'create':
        toast.promise(
          create.mutateAsync(createPayload, { onSuccess: closeModal }),
          toasts().createAssistant
        )
        break
      case 'clone':
        toast.promise(
          clone.mutateAsync({ data, name }, { onSuccess: closeModal }),
          toasts().cloneAssistant
        )
        break
      case 'edit':
        toast.promise(
          rename.mutateAsync({ data, name }, { onSuccess: closeModal }),
          toasts().renameAssistant
        )
        break
      default:
        break
    }
  }

  useOnKey(handleSubmit(onFormSubmit), 'Enter') //FIX

  useObserver('AssistantModal', handleEventUpdate)

  useEffect(() => {
    const botLang = bot?.language?.value!
    const botDisplayLang = language()[botLang] as TLang
    const botLangValue = {
      id: botLang,
      name: botLang,
      display_name: botDisplayLang,
    }
    setValue(LANGUAGE, isCreateFromScratch ? defaultLangValue : botLangValue)
  }, [isOpen, bot])

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
            {isCloning && t('modals.assistant.clone.header')}
            {isEditing && t('modals.assistant.edit.header')}
            {isCreateFromScratch &&
              t('modals.assistant.create_from_scratch.header')}
          </h4>
          {!isCreateFromScratch && <mark>{bot?.display_name}</mark>}
          <div className={s.distribution}>
            {isEditing
              ? t('modals.assistant.edit.subheader')
              : t('modals.assistant.subheader')}
          </div>
        </div>
        {isCreateFromScratch && (
          <div className={s.dropboxArea}>
            <SkillDropboxSearch
              className={s.dropbox}
              withoutSearch
              disabled={!isCreateFromScratch}
              rules={{ required: true }}
              fullWidth
              list={
                Object.entries(language()).map(s => {
                  const id = s[0]
                  const displayName = s[1]
                  return {
                    id: id,
                    name: id,
                    display_name: displayName,
                  }
                }) || []
              }
              name={LANGUAGE}
              label={t('modals.assistant.language_field.label')}
              control={control}
            />
            <div className={s.annotation}>
              {t('modals.assistant.language_field.annotation')}
            </div>
          </div>
        )}
        <Input
          label={t('modals.assistant.name_field.label')}
          name={NAME_ID}
          control={control}
          rules={{
            required: validationSchema.global.required,
            pattern: validationSchema.global.regExpPattern,
          }}
          props={{
            placeholder: t('modals.assistant.name_field.placeholder'),
          }}
        />
        <div className={s.textarea}>
          <TextArea
            label={t('modals.assistant.desc_field.label')}
            name={DESC_ID}
            control={control}
            withCounter
            rules={{
              required: validationSchema.global.required,
              maxLength: validationSchema.global.desc.maxLength(1000),
              pattern: validationSchema.global.regExpPattern,
            }}
            props={{
              placeholder: t('modals.assistant.desc_field.placeholder'),
              rows: 6,
            }}
          />
        </div>

        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: closeModal }}>
            {t('modals.assistant.btns.cancel')}
          </Button>
          {isCreateFromScratch && (
            <Button
              theme='primary'
              props={{ type: 'submit', disabled: create?.isLoading }}
            >
              {t('modals.assistant.btns.create')}
            </Button>
          )}
          {isCloning && (
            <Button
              theme='primary'
              props={{ type: 'submit', disabled: clone?.isLoading }}
            >
              {t('modals.assistant.btns.create')}
            </Button>
          )}
          {isEditing && (
            <Button
              theme='primary'
              props={{ type: 'submit', disabled: rename?.isLoading }}
            >
              {t('modals.assistant.btns.save')}
            </Button>
          )}
        </div>
      </form>
    </BaseModal>
  )
}
