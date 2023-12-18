import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { generatePath, useNavigate } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { BotInfoInterface, TDistVisibility } from 'types/types'
import { VISIBILITY_STATUS } from 'constants/constants'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { trigger } from 'utils/events'
import { Button } from 'components/Buttons'
import { BaseModal } from 'components/Modals'
import s from './PublicToPrivateModal.module.scss'

type ActionTypes = 'edit' | 'rename' | 'unpublish'

interface IEventDetail {
  detail: {
    bot: BotInfoInterface
    action: ActionTypes
    newVisibility?: TDistVisibility
  }
}

export const PublicToPrivateModal = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [bot, setBot] = useState<BotInfoInterface | null>(null)
  const [action, setAction] = useState<ActionTypes | null>(null)
  const [newVisibility, setNewVisibility] = useState<TDistVisibility>(
    VISIBILITY_STATUS.PRIVATE
  )
  const navigate = useNavigate()

  const handleEventUpdate = ({
    detail: { bot, action, newVisibility },
  }: IEventDetail) => {
    setBot(bot)
    setAction(action)
    setIsOpen(!isOpen)
    setNewVisibility(newVisibility || VISIBILITY_STATUS.PRIVATE)
  }
  const queryClient = useQueryClient()
  const { changeVisibility } = useAssistants()
  const handleCancelClick = () => setIsOpen(false)

  const handleYesClick = () => {
    const name = bot?.name!
    action === 'edit' &&
      changeVisibility
        .mutateAsync({ name, newVisibility })
        .then(() => setIsOpen(false))
        .then(() =>
          navigate(generatePath(RoutesList.editor.skills, { name: bot?.name! }))
        )
    action === 'rename' &&
      changeVisibility
        .mutateAsync({ name, newVisibility })
        .then(() => {
          queryClient.invalidateQueries(['publicDists'])
          setIsOpen(false)
        })
        .then(() => trigger('AssistantModal', { bot, action: 'edit' }))
    action === 'unpublish' &&
      toast
        .promise(
          changeVisibility.mutateAsync({
            name,
            newVisibility,
            deploymentState: bot?.deployment.state,
          }),
          {
            loading: t('modals.publish_assistant.toasts.loading'),
            success: t('toasts.success'),
            error: t('toasts.error'),
          }
        )
        .then(() => setIsOpen(false))
  }

  useObserver('PublicToPrivateModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.publicToPrivateModal}>
        <div className={s.header}>
          {t('modals.hide_public_assistant.header')}
        </div>
        <div className={s.desc}>
          {t('modals.hide_public_assistant.subheader')}
        </div>
        <div className={s.footer}>
          <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            {t('modals.hide_public_assistant.btns.cancel')}
          </Button>
          <Button theme='error' props={{ onClick: handleYesClick }}>
            {t('modals.hide_public_assistant.btns.yes')}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
