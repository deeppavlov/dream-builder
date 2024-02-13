import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import store from 'store2'
import { BotInfoInterface, TDistVisibility, Visibility } from 'types/types'
import {
  HIDE_PUBLISH_ALERT_KEY,
  PUBLISH_REQUEST_STATUS,
  VISIBILITY_STATUS,
} from 'constants/constants'
import { getAssistantVisibility } from 'mapping/assistantVisibility'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { trigger } from 'utils/events'
import { Button, RadioButton } from 'components/Buttons'
import { BaseToolTip } from 'components/Menus'
import { BaseModal } from 'components/Modals'
import s from './PublishAssistantModal.module.scss'

interface FormValues {
  publishAlert: boolean
  visibility: Visibility
}
export const PublishAssistantModal = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [bot, setBot] = useState<BotInfoInterface | null>(null)
  const { name: distName } = useParams()
  const inEditor = distName !== undefined && distName.length > 0
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        visibility: bot?.visibility,
      },
    })
  const { changeVisibility } = useAssistants()
  const botOnModeration =
    bot?.publish_state === PUBLISH_REQUEST_STATUS.IN_REVIEW
  const visibilityList = getAssistantVisibility(botOnModeration)
  const selectedVisibility = watch('visibility')
  const isSelectedVisibilityPublic =
    selectedVisibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
  const currentVisibility = bot?.visibility
  const isVisibilityChange = selectedVisibility !== currentVisibility

  const sendButtonIsDisabled =
    changeVisibility?.isLoading ||
    (!isVisibilityChange && !botOnModeration) ||
    (botOnModeration && isSelectedVisibilityPublic)

  const handleEventUpdate = (data: { detail: any }) => {
    setBot(data?.detail.bot)
    setIsOpen(prev => !prev)
  }

  const handleNoBtnClick = () => closeModal()

  const handlePublish = (data: FormValues) => {
    const hidePublishAlert = store(HIDE_PUBLISH_ALERT_KEY)

    const newVisibility = data.visibility as TDistVisibility
    const name = bot?.name!
    const deploymentState = bot?.deployment?.state

    const isAlreadyPublicTemplate =
      currentVisibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
    const isPublicTemplate = newVisibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
    const isInReview = bot?.publish_state == PUBLISH_REQUEST_STATUS.IN_REVIEW
    // if assistant on review it means that it pretend to be public template,
    // so no need to publish it again

    const publish = async () => {
      await changeVisibility.mutateAsync({
        name,
        newVisibility,
        inEditor,
        deploymentState,
      })
    }

    const user = store('user')
    if (isPublicTemplate && !isInReview && (!hidePublishAlert || !user.email)) {
      trigger('PublishAssistantWizard', {
        bot,
        inEditor,
        deploymentState,
      })
      closeModal()
      return
    }
    if (isInReview && isPublicTemplate) {
      closeModal()
      return
    }
    if (isAlreadyPublicTemplate) {
      trigger('PublicToPrivateModal', {
        bot,
        action: 'unpublish',
        newVisibility,
      })
      closeModal()
      return
    }

    toast
      .promise(publish(), {
        loading: t('modals.publish_assistant.toasts.loading'),
        success: isPublicTemplate
          ? t('modals.publish_assistant.toasts.submitted')
          : t('toasts.success'),
        error: t('toasts.error'),
      })
      .then(() => closeModal())
  }

  const closeModal = () => {
    reset()
    setIsOpen(false)
    setBot(null)
  }

  useEffect(() => {
    const isVisibility = bot?.visibility !== undefined
    const newVisibility =
      bot?.publish_state === 'IN_REVIEW'
        ? 'PUBLIC_TEMPLATE'
        : bot?.visibility ?? null
    if (isVisibility) setValue('visibility', newVisibility)
  }, [bot?.visibility])

  useObserver('PublishAssistantModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={closeModal}>
      <div className={s.publishAssistantModal}>
        <div className={s.header}>
          <h4>{t('modals.publish_assistant.header')}</h4>
        </div>
        <form onSubmit={handleSubmit(handlePublish)} className={s.form}>
          <div className={s.body}>
            <div className={s.radio}>
              {visibilityList.map(type => {
                return (
                  <RadioButton
                    props={{
                      ...register('visibility', { required: true }),
                    }}
                    tooltipId={type.id}
                    key={type.id}
                    name={type.id}
                    id={type.name}
                    htmlFor={type.name}
                    value={type.id}
                    disabled={type.name === 'Public'}
                  >
                    {type.description}
                  </RadioButton>
                )
              })}
            </div>
          </div>
          <div className={s.btns}>
            <Button theme='secondary' props={{ onClick: handleNoBtnClick }}>
              {t('modals.publish_assistant.btns.no')}
            </Button>
            <Button
              theme='primary'
              props={{
                type: 'submit',
                disabled: sendButtonIsDisabled,
              }}
            >
              {isSelectedVisibilityPublic
                ? t('modals.publish_assistant.btns.publish')
                : t('modals.publish_assistant.btns.save')}
            </Button>
          </div>
        </form>
      </div>
      <BaseToolTip
        id={VISIBILITY_STATUS.PUBLIC_TEMPLATE}
        content={t('modals.publish_assistant.tooltips.public')}
        theme='small'
      />
      <BaseToolTip
        id={VISIBILITY_STATUS.UNLISTED_LINK}
        content={t('modals.publish_assistant.tooltips.unlisted')}
        theme='small'
      />
    </BaseModal>
  )
}
