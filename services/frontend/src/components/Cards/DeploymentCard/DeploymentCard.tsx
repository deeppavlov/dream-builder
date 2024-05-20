import { FC } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IDeploymentState } from 'types/types'
import { VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants, useDeploy } from 'hooks/api'
import { Button } from 'components/Buttons'
import { BaseToolTip } from 'components/Menus'
import { Wrapper } from 'components/UI'
import s from './DeploymentCard.module.scss'

type IHandlerStop = (
  e: React.MouseEvent<HTMLButtonElement>,
  deployment: IDeploymentState
) => void

interface ICardProps {
  deployment: IDeploymentState
}

export const DeploymentCard: FC<ICardProps> = ({ deployment }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_page' })
  const { deleteDeployment } = useDeploy()
  const { changeVisibility } = useAssistants()

  const handleStop: IHandlerStop = (e, deployment) => {
    const assistantWithoutDeploymentField = deployment.virtual_assistant
    const { virtual_assistant, ...deploymentField } = deployment

    const assistant = {
      ...assistantWithoutDeploymentField,
      deployment: deploymentField,
    }

    toast.promise(
      deleteDeployment.mutateAsync(assistant).then(() => {
        changeVisibility.mutateAsync({
          name: virtual_assistant.name,
          newVisibility: VISIBILITY_STATUS.PRIVATE,
        })
      }),
      toasts().deleteDeployment
    )
    e.stopPropagation()
  }

  return (
    <Wrapper>
      <div className={s.card}>
        <span style={{ overflow: 'hidden' }}>
          <b>{t('deployment_card.id')}: </b>
          {deployment?.id}
        </span>
        <span className={s.name}>
          <b>{t('deployment_card.name')}: </b>
          {deployment?.virtual_assistant?.name}
        </span>
        <span className={s.displayName}>
          <b>{t('deployment_card.display_name')}: </b>
          {deployment?.virtual_assistant?.display_name}
        </span>
        <span>
          <b>{t('deployment_card.author')}: </b>
          {deployment?.virtual_assistant?.author?.name}
        </span>
        <span
          className={s.description}
          style={{ cursor: 'pointer' }}
          data-tooltip-id={deployment?.id + deployment?.virtual_assistant?.name}
        >
          <BaseToolTip
            delayShow={500}
            id={deployment?.id + deployment?.virtual_assistant?.name}
            content={deployment?.virtual_assistant?.description}
            place='bottom'
            theme='description'
          />
          <b>{t('deployment_card.description')}: </b>
          <span>{deployment?.virtual_assistant?.description}</span>
        </span>
        <div className={s.btnContainer}>
          <Button
            small
            theme='primary'
            props={{
              onClick: e => handleStop(e, deployment),
              disabled: deleteDeployment.isLoading,
            }}
          >
            {t('deployment_card.stop')}
          </Button>
        </div>
      </div>
    </Wrapper>
  )
}
