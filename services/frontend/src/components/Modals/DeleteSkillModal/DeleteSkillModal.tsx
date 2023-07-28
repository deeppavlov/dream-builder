import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { ISkill, TDistVisibility } from 'types/types'
import { DEPLOY_STATUS, VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants, useComponent, useDeploy } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { Button } from 'components/Buttons'
import { BaseModal } from 'components/Modals'
import s from './DeleteSkillModal.module.scss'

export const DeleteSkillModal = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.delete_skill',
  })
  const [isOpen, setIsOpen] = useState(false)
  const { name: distName } = useParams()
  const [skill, setSkill] = useState<ISkill>()
  const { getDist } = useAssistants()
  const { deleteComponent } = useComponent()
  const { deleteDeployment } = useDeploy()
  const { data: bot } = getDist({ distName })

  const handleEventUpdate = ({ detail }: any) => {
    setSkill(detail?.skill)
    setIsOpen(prev => !prev)
  }
  const { changeVisibility } = useAssistants()
  const deleteSkill = async () => {
    if (!skill?.id) return

    const isDeployed = bot?.deployment?.state === DEPLOY_STATUS.UP //FIX

    await toast.promise(
      deleteComponent.mutateAsync(
        {
          distName: distName || '',
          id: skill.id,
          component_id: skill.component_id,
          type: 'skills',
        },
        {
          onSuccess: () => {
            isDeployed &&
              deleteDeployment.mutateAsync(bot).then(() => {
                // unpublish
                const name = bot?.name
                const visibility = VISIBILITY_STATUS.PRIVATE as TDistVisibility
                const publishState = bot.publish_state !== null
                publishState &&
                  changeVisibility.mutateAsync({ name, visibility }) //FIX
              })
          },
        }
      ),
      toasts().deleteComponent
    )
  }

  const handleCancelClick = () => setIsOpen(false)

  const handleYesClick = () => {
    deleteSkill().then(() => setIsOpen(false))
  }

  useObserver('DeleteSkillModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.areYouSure}>
        <div className={s.header}>
          <h4>{t('header')}</h4>
          <mark>{skill?.display_name}</mark>
          <div className={s.desc}>{t('subheader')}</div>
        </div>
        <div className={s.footer}>
          <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            {t('btns.cancel')}
          </Button>
          <Button theme='error' props={{ onClick: handleYesClick }}>
            {t('btns.delete')}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
