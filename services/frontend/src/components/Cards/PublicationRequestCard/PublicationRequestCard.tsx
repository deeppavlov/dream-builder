import { FC, useId } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { IPublicationRequest, RequestProps } from 'types/types'
import { TOOLTIP_DELAY } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAdmin } from 'hooks/api'
import { useGaPublication } from 'hooks/googleAnalytics/useGaPublication'
import { dateToUTC } from 'utils/dateToUTC'
import { Button } from 'components/Buttons'
import { BaseToolTip } from 'components/Menus'
import { Wrapper } from 'components/UI'
import s from './PublicationRequestCard.module.scss'

type IHandler = (
  e: React.MouseEvent<HTMLButtonElement>,
  request: IPublicationRequest
) => void

export const PublicationRequestCard: FC<RequestProps> = ({ request }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_page' })
  const { publicationRequestHandled } = useGaPublication()
  const tooltipId = useId()
  const navigate = useNavigate()
  const { confirm, decline } = useAdmin()

  const cardClickHandler = () => {
    navigate(
      generatePath(RoutesList.editor.skills, {
        name: request.virtual_assistant.name,
      })
    )
  }
  const handleApprove: IHandler = (e, request) => {
    publicationRequestHandled(request, 'accept')

    toast.promise(confirm.mutateAsync(request.id), toasts().confirmRequest)
    e.stopPropagation()
  }

  const handleDecline: IHandler = (e, request) => {
    publicationRequestHandled(request, 'decline')

    toast.promise(decline.mutateAsync(request.id), toasts().declineRequest)
    e.stopPropagation()
  }

  return (
    <>
      <div className={s.container} onClick={cardClickHandler}>
        <Wrapper forCard>
          <span>
            <b>{t('request_card.id')}: </b>
            {request?.id}
          </span>
          <span>
            <b>{t('request_card.name')}: </b>
            {request?.virtual_assistant?.name}
          </span>
          <span className={s.displayName}>
            <b>{t('request_card.display_name')}: </b>
            {request?.virtual_assistant?.display_name}
          </span>
          <span
            className={s.description}
            data-tooltip-id={'requestDesc' + tooltipId}
          >
            <b>{t('request_card.description')}: </b>
            {request?.virtual_assistant?.description}
          </span>
          <BaseToolTip
            id={'requestDesc' + tooltipId}
            content={request?.virtual_assistant?.description}
            place='bottom'
            theme='description'
            delayShow={TOOLTIP_DELAY - 500}
          />
          <span>
            <b>{t('request_card.date_created')}: </b>
            {dateToUTC(request?.date_created)}
          </span>
          <span className={s.author}>
            <b>{t('request_card.author')}:</b>
            <img
              className={s.img}
              src={request?.virtual_assistant?.author?.picture}
            />
            {request?.virtual_assistant?.author?.name}
          </span>
          <span>
            <b>{t('request_card.email')}: </b>
            {request?.virtual_assistant?.author?.email}
          </span>
          <div className={s.buttons}>
            <Button
              small
              props={{
                onClick: e => handleDecline(e, request),
                disabled: decline?.isLoading,
              }}
              theme='secondary'
            >
              {t('request_card.decline')}
            </Button>
            <Button
              small
              theme='primary'
              props={{
                onClick: e => handleApprove(e, request),
                disabled: confirm?.isLoading,
              }}
            >
              {t('request_card.approve')}
            </Button>
          </div>
        </Wrapper>
      </div>
    </>
  )
}
