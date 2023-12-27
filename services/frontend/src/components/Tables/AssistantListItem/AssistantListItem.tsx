import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { FC, useId } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from 'react-query'
import { generatePath, useNavigate } from 'react-router-dom'
import { ReactComponent as Clone } from 'assets/icons/clone.svg'
import { ReactComponent as Edit } from 'assets/icons/edit_pencil.svg'
import DB from 'assets/icons/logo.png'
import { RoutesList } from 'router/RoutesList'
import { BotAvailabilityType, BotInfoInterface } from 'types/types'
import {
  DEPLOY_STATUS,
  PUBLISH_REQUEST_STATUS,
  VISIBILITY_STATUS,
} from 'constants/constants'
import { getDeploy } from 'api/deploy'
import { useAssistants, useComponent } from 'hooks/api'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { Button, Kebab } from 'components/Buttons'
import { AssistantContextMenu, StatusToolTip } from 'components/Menus'
import { AssistantSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { SmallTag } from 'components/UI'
import s from './AssistantListItem.module.scss'

interface AssistantListItemProps {
  type: BotAvailabilityType
  bot: BotInfoInterface
  disabled?: boolean
}

const RenderStatusToolTip = ({
  type,
  bot,
  getAllComponents,
}: {
  type: string
  bot: BotInfoInterface
  getAllComponents: Function
}) => {
  if (type === 'your') {
    const components = getAllComponents(bot.name || '', {
      refetchOnMount: true,
    })

    if (components.data && components.data.skills) {
      return (
        <StatusToolTip
          name='assistant'
          skills={components.data.skills}
          bot={bot}
        />
      )
    }
  }
  return null
}

export const AssistantListItem: FC<AssistantListItemProps> = ({
  type,
  bot,
  disabled,
}) => {
  const { getAllComponents } = useComponent()
  const cx = classNames.bind(s)
  const navigate = useNavigate()
  const { refetchDist } = useAssistants()
  const tooltipId = useId()
  const { createVaClick, vaPropsOpened, setVaArchitectureOptions } =
    useGaAssistant()

  const { UIOptions } = useUIOptions()
  const infoSPId = `info_${bot.id}`
  const activeAssistantId = UIOptions[consts.ACTIVE_ASSISTANT_SP_ID]
  const isActive =
    infoSPId === activeAssistantId || bot.id === activeAssistantId

  const onModeration = bot?.publish_state === PUBLISH_REQUEST_STATUS.IN_REVIEW
  const published = bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
  const deployed = bot?.deployment?.state === DEPLOY_STATUS.UP //FIX
  const deploying =
    !deployed && bot?.deployment?.state !== null && bot?.deployment !== null
  const privateAssistant = bot?.visibility === VISIBILITY_STATUS.PRIVATE
  const unlistedAssistant = bot?.visibility === VISIBILITY_STATUS.UNLISTED_LINK

  const { t } = useTranslation()
  const publishState = onModeration
    ? t('assistant_visibility.on_moderation')
    : published
    ? t('assistant_visibility.public_template')
    : unlistedAssistant
    ? t('assistant_visibility.unlisted')
    : privateAssistant
    ? t('assistant_visibility.private')
    : null

  const isDeepyPavlova =
    import.meta.env.VITE_SUB_FOR_DEFAULT_TEMPLATES === bot?.author?.outer_id
  const author = isDeepyPavlova ? 'Dream Builder Team' : bot?.author?.name

  const handleAssistantListItemClick = () => {
    const isOpen = activeAssistantId !== infoSPId
    isOpen && vaPropsOpened('va_card_click', bot)

    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen,
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
    createVaClick('va_templates_block', bot)

    e.stopPropagation()
    const assistantClone = { action: 'clone', bot: bot }

    if (!disabled) {
      trigger('AssistantModal', assistantClone)
      return
    }

    trigger('SignInModal', {
      requestModal: { name: 'AssistantModal', options: assistantClone },
      msg: <Trans i18nKey='modals.sign_in.build' />,
    })
  }

  const handlEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setVaArchitectureOptions('va_block')
    e.stopPropagation()
    navigate(generatePath(RoutesList.editor.skills, { name: bot?.name }), {
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
      bot?.deployment?.state !== DEPLOY_STATUS.UP, //FIX
    onSuccess(data) {
      console.log('bot?.deployment?.id = ', bot?.deployment?.id)
      data?.state === DEPLOY_STATUS.UP && //FIX
        refetchDist.mutateAsync(bot?.name!)

      if (
        data?.state !== DEPLOY_STATUS.UP &&
        data?.state !== null &&
        data?.error == null
      ) {
        //FIX
        setTimeout(() => {
          queryClient.invalidateQueries(['deploy', data?.id])
        }, 5000)
      } else if (data?.error !== null) {
        console.log('error')
      }
    },
  })

  return (
    <tr
      className={cx('tr', isActive && 'active')}
      onClick={handleAssistantListItemClick}
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
        <div className={s.listError}>
          <RenderStatusToolTip
            getAllComponents={getAllComponents}
            type={type}
            bot={bot}
          />
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
        <div className={s.lng}>{bot.language?.value}</div>
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
                isDeployed={deployed}
              />
            </>
          ) : (
            <>
              <Kebab tooltipId={tooltipId} theme='card' />
              <AssistantContextMenu
                tooltipId={tooltipId}
                bot={bot}
                type={type}
                isDeployed={deployed}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
