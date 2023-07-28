import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { BotInfoInterface } from 'types/types'
import { VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { Button } from 'components/Buttons'
import { BaseModal } from 'components/Modals'
import s from './DeleteAssistantModal.module.scss'

interface IDeleteAssistantModal {
  bot: BotInfoInterface
}

export const DeleteAssistantModal = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.delete_assistant',
  })
  const [isOpen, setIsOpen] = useState(false)
  const [bot, setBot] = useState<BotInfoInterface | null>()
  const queryClient = useQueryClient()
  const { deleteDist } = useAssistants()
  const { name } = useParams()
  const navigate = useNavigate()

  const isEditorRoute = name !== undefined && name.length > 0
  const assistantIsPublic =
    bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE

  const handleClose = () => {
    setBot(null)
    setIsOpen(false)
    if (isEditorRoute) navigate(RoutesList.start)
  }
  const handleEventUpdate = (data: { detail: IDeleteAssistantModal }) => {
    setBot(data.detail.bot ?? null)
    setIsOpen(prev => !prev)
  }

  const handleCancelBtnClick = () => handleClose()

  const handleDeleteBtnClick = () => {
    handleClose()
    toast
      .promise(deleteDist.mutateAsync(bot?.name!), toasts().deleteAssistant)
      .then(() => {
        assistantIsPublic && queryClient.invalidateQueries(['publicDists'])
      })
  }

  useObserver('DeleteAssistantModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={handleClose}>
      <div className={s.deleteAssistantModal}>
        <h4>
          {t('header')}
          <br />
          <mark>{bot?.display_name}</mark>
        </h4>
        <span className={s.desc}>
          {t('subheader')}
          <br />
          {assistantIsPublic && t('public_subheader')}
        </span>

        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handleCancelBtnClick }}>
            {t('btns.cancel')}
          </Button>
          <Button theme='error' props={{ onClick: handleDeleteBtnClick }}>
            {t('btns.delete')}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
