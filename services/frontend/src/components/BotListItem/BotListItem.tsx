import DB from '@assets/icons/logo.png'
import { FC, useId } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Clone } from '../../assets/icons/clone.svg'
import { ReactComponent as Edit } from '../../assets/icons/edit_pencil.svg'
import { useDisplay } from '../../context/DisplayContext'
import { getDeploy } from '../../services/getDeploy'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import Button from '../../ui/Button/Button'
import { Kebab } from '../../ui/Kebab/Kebab'
import { consts } from '../../utils/consts'
import { dateToUTC } from '../../utils/dateToUTC'
import { trigger } from '../../utils/events'
import { timeToUTC } from '../../utils/timeToUTC'
import AssistantContextMenu from '../AssistantContextMenu/AssistantContextMenu'
import AssistantSidePanel from '../AssistantSidePanel/AssistantSidePanel'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './BotListItem.module.scss'

interface BotListItemProps {
  type: BotAvailabilityType
  bot: BotInfoInterface
  disabled?: boolean
}

export const BotListItem: FC<BotListItemProps> = ({ type, bot, disabled }) => {
  const navigate = useNavigate()
  const tooltipId = useId()
  const dateCreated = dateToUTC(new Date(bot?.date_created))
  const time = timeToUTC(new Date(bot?.date_created))
  const { options } = useDisplay()
  const infoSPId = `info_${bot.id}`
  const activeAssistantId = options.get(consts.ACTIVE_ASSISTANT_SP_ID)
  const isActive =
    infoSPId === activeAssistantId || bot.id === activeAssistantId

  const onModeration = bot?.publish_state === 'in_progress'
  const published = bot?.visibility === 'public_template'
  const deployed = bot?.deployment?.state === 'UP'
  const deploying =
    !deployed && bot?.deployment?.state !== null && bot?.deployment !== null

  const publishState = !bot?.publish_state
    ? type === 'your' && bot?.visibility
    : onModeration
    ? 'On Moderation'
    : published
    ? 'Public Template'
    : bot?.visibility

  const isDeepyPavlova = import.meta.env.VITE_SUB_FOR_DEFAULT_TEMPLATES
  const author = isDeepyPavlova ? 'Dream Builder Team' : bot?.author?.fullname!

  const handleBotListItemClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: activeAssistantId !== infoSPId,
      children: (
        <AssistantSidePanel
          type={type}
          key={bot?.id}
          name={bot.name}
          disabled={disabled}
        />
      ),
    })
  }

  const handleCloneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const assistantClone = { action: 'clone', bot: bot }

    if (!disabled) {
      trigger('AssistantModal', assistantClone)
      return
    }

    trigger('SignInModal', {
      requestModal: { name: 'AssistantModal', options: assistantClone },
    })
  }

  const handlEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    navigate(`/${bot?.name}`, {
      state: {
        preview: false,
        distName: bot?.name,
        displayName: bot?.display_name,
      },
    })
  }
  const queryClient = useQueryClient()

  const status = useQuery({
    queryKey: ['deploy', bot?.deployment?.id],
    queryFn: () => getDeploy(bot?.deployment?.id!),
    refetchOnMount: false,
    enabled:
      bot?.deployment?.id !== undefined &&
      type !== 'public' &&
      bot?.deployment?.state !== 'UP',
    onSuccess(data) {
      console.log('bot?.deployment?.id = ', bot?.deployment?.id)
      data?.state === 'UP' &&
        queryClient.invalidateQueries('dist', data?.virtual_assistant?.name)

      if (data?.state !== 'UP' && data?.state !== null && data?.error == null) {
        setTimeout(() => {
          queryClient.invalidateQueries('deploy', data?.id)
        }, 5000)
      } else if (data?.error !== null) {
        console.log('error')
      }
    },
  })
  return (
    <tr
      className={s.tr}
      onClick={handleBotListItemClick}
      data-active={isActive}
    >
      <td className={s.td}>
        <div className={s.name}>
          <p className={s.botName}>{bot?.display_name || '------'}</p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.author}>
          {isDeepyPavlova ? (
            <img src={DB} alt='Author' />
          ) : (
            <img src={bot?.author?.picture} />
          )}
          <p>{author}</p>
        </div>
      </td>
      <td className={s.td}>
        <div
          className={s.description}
          data-tooltip-id={'botTableDesc' + tooltipId}
        >
          {bot?.description}
        </div>
      </td>
      <td className={s.td}>
        <div className={s.visibility}>
          {
            <SmallTag theme={onModeration ? 'validating' : bot?.visibility}>
              {publishState}
            </SmallTag>
          }
        </div>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{dateCreated || '------'}</p>
          <p className={s.time}>{time || '------'}</p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <Button
            theme='primary'
            small
            withIcon
            props={{
              disabled: onModeration || deploying,
              onClick: type === 'public' ? handleCloneClick : handlEditClick,
            }}
          >
            {type === 'public' ? <Clone /> : <Edit />}
          </Button>
          {type === 'your' ? (
            <>
              <Kebab tooltipId={'ctxMenu' + tooltipId} theme='card' />
              <AssistantContextMenu
                tooltipId={'ctxMenu' + tooltipId}
                bot={bot}
                type={type}
              />
            </>
          ) : (
            <>
              <Kebab tooltipId={tooltipId} theme='card' />
              <AssistantContextMenu
                tooltipId={tooltipId}
                bot={bot}
                type={type}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
