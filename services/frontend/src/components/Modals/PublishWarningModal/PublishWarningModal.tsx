import i18next from 'i18next'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import store from 'store2'
import {
  BotInfoInterface,
  TDeploymentState,
  TDistVisibility,
} from 'types/types'
import { HIDE_PUBLISH_ALERT_KEY, VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { Button, Checkbox } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { BaseModal } from 'components/Modals'
import s from './PublishWarningModal.module.scss'

export const PublishWarningModal = () => {
  const [bot, setBot] = useState<BotInfoInterface>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [inEditor, setInEditor] = useState<boolean>(false)
  const [deploymentState, setDeploymentState] = useState<TDeploymentState>()

  const { t } = useTranslation()
  const hidePublishAlert = store(HIDE_PUBLISH_ALERT_KEY)
  const { register } = useForm({
    defaultValues: {
      [HIDE_PUBLISH_ALERT_KEY]: hidePublishAlert,
    },
  })
  const { changeVisibility } = useAssistants()

  const handleEventUpdate = (data: any) => {
    setBot(data.detail.bot)
    setInEditor(data.detail.inEditor)
    setDeploymentState(data.detail.deploymentState)
    setIsOpen(prev => !prev)
  }
  const handleCancel = () => setIsOpen(prev => !prev)
  const handleContinue = () => {
    const name = bot?.name!
    const newVisibility = VISIBILITY_STATUS.PUBLIC_TEMPLATE as TDistVisibility
    // user can get to this modal only if he wants to publish assistant
    setIsOpen(false)
    toast.promise(
      changeVisibility.mutateAsync({
        name,
        newVisibility,
        inEditor,
        deploymentState,
      }),
      toasts.publishAssistant
    )
  }
  const handleChange = (v: any) =>
    store(HIDE_PUBLISH_ALERT_KEY, v.target.checked)

  useObserver('PublishWarningModal', handleEventUpdate)
  return (
    <>
      <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={s.publishWarningModal}>
          <div className={s.header}>
            <div className={s.circle}>
              <SvgIcon iconName={'attention'} />
            </div>
            <h3 className={s.title}>
              {t('modals.publish_warning_modal.title')}
            </h3>
          </div>
          <div className={s.body}>
            <div className={s.upper}>
              {t('modals.publish_warning_modal.upper')}
            </div>
            <div className={s.bottom}>
              {t('modals.publish_warning_modal.bottom')}
            </div>
          </div>
          <div className={s.footer}>
            <Button theme='secondary' props={{ onClick: handleCancel }}>
              {t('modals.publish_warning_modal.btns.cancel')}
            </Button>
            <Button theme='primary' props={{ onClick: handleContinue }}>
              {t('modals.publish_warning_modal.btns.continue')}
            </Button>
          </div>
          <div className={s.checkbox}>
            <Checkbox
              theme='secondary'
              name='alertMessage'
              label={i18next.t('modals.publish_assistant.checkbox')}
              props={{
                ...register(HIDE_PUBLISH_ALERT_KEY),
                onChange: v => handleChange(v),
              }}
            />
          </div>
        </div>
      </BaseModal>
    </>
  )
}
