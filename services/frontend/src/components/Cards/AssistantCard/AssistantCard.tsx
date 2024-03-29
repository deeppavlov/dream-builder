import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { FC, useEffect, useId } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from 'react-query'
import { generatePath, useNavigate } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { BotCardProps, BotInfoInterface } from 'types/types'
import {
  DEPLOY_STATUS,
  PRIVATE_DISTS,
  VISIBILITY_STATUS,
} from 'constants/constants'
import { getDeploy } from 'api/deploy/getDeploy'
import { useAssistants } from 'hooks/api'
import { useComponent } from 'hooks/api'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { getAssistantState } from 'utils/getAssistantState'
import { Button, Kebab } from 'components/Buttons'
import { AssistantContextMenu } from 'components/Menus'
import { AssistantSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Badge, SmallTag } from 'components/UI'
import { StatusToolTip } from '../../Menus/index'
import s from './AssistantCard.module.scss'

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

export const AssistantCard: FC<BotCardProps> = ({
  type,
  bot,
  size,
  disabled,
}) => {
  const { getAllComponents } = useComponent()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const tooltipId = useId()
  const { UIOptions } = useUIOptions()
  const queryClient = useQueryClient()
  const { refetchDist } = useAssistants()
  const { createVaClick, vaPropsOpened, setVaArchitectureOptions } =
    useGaAssistant()

  const activeAssistantId = UIOptions[consts.ACTIVE_ASSISTANT_SP_ID]
  const activeChat = UIOptions[consts.CHAT_SP_IS_ACTIVE]

  const infoSPId = `info_${bot.id}`
  const isActive =
    infoSPId === activeAssistantId ||
    bot.id === activeAssistantId ||
    bot.id === activeChat?.id

  const { onModeration, isDeployed, isDeploying } = getAssistantState(bot)
  let cx = classNames.bind(s)

  const isPublished = bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
  const privateAssistant = bot?.visibility === VISIBILITY_STATUS.PRIVATE
  const unlistedAssistant = bot?.visibility === VISIBILITY_STATUS.UNLISTED_LINK

  const publishState = onModeration
    ? t('assistant_visibility.on_moderation')
    : isPublished
    ? t('assistant_visibility.public_template')
    : unlistedAssistant
    ? t('assistant_visibility.unlisted')
    : privateAssistant
    ? t('assistant_visibility.private')
    : null

  const handleBotCardClick = () => {
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

    const assistantClone = { action: 'clone', bot: bot }

    if (!disabled) {
      e.stopPropagation()
      return trigger('AssistantModal', assistantClone)
    }

    trigger('SignInModal', {
      requestModal: { name: 'AssistantModal', options: assistantClone },
      msg: <Trans i18nKey='modals.sign_in.build' />,
    })

    e.stopPropagation()
  }

  const handlEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setVaArchitectureOptions('va_block')
    isPublished
      ? trigger('PublicToPrivateModal', { bot, action: 'edit' })
      : navigate(generatePath(RoutesList.editor.skills, { name: bot?.name }))
    e.stopPropagation()
  }

  const status = useQuery({
    queryKey: ['deploy', bot?.deployment?.id],
    queryFn: () => getDeploy(bot?.deployment?.id!),
    refetchOnMount: false,
    enabled:
      bot?.deployment?.id !== undefined &&
      type !== 'public' &&
      bot?.deployment?.state !== DEPLOY_STATUS.UP,
    onSuccess(data) {
      if (data?.state === DEPLOY_STATUS.UP) {
        queryClient.invalidateQueries(['privateDists'])
        refetchDist.mutateAsync(bot?.name)
      }
      if (
        data?.state !== DEPLOY_STATUS.UP &&
        data?.state !== null &&
        data?.error == null
      ) {
        setTimeout(() => {
          queryClient.invalidateQueries(['deploy', data?.id])
        }, 5000)
      } else if (data?.error !== null) {
        console.log('error')
      }
    },
  })
  useEffect(() => {
    queryClient.invalidateQueries([PRIVATE_DISTS])
  }, [status.data?.state])

  return (
    <div
      className={cx('assistantCard', `${type}`, size)}
      onClick={handleBotCardClick}
      data-active={isActive}
    >
      {type === 'your' && isDeployed && <Badge />}
      <div className={cx('header', isDeploying && 'deploying')}>
        <span>{bot?.display_name}</span>
        <div
          data-tooltip-id='my-tooltip'
          data-tooltip-content='Hello world!'
          data-tooltip-variant='warning'
          data-tooltip-place='right'
          className={s.status}
        ></div>
      </div>
      <div className={s.body}>
        <div className={s.block}>
          <div className={s.desc} data-tooltip-id={'botCardDesc' + bot?.name}>
            {bot?.description}
          </div>
          <div className={s.langAndVersion}>
            <div className={s.box}>
              <SmallTag theme={onModeration ? 'validating' : bot?.visibility}>
                {publishState}
              </SmallTag>
              {
                <RenderStatusToolTip
                  type={type}
                  bot={bot}
                  getAllComponents={getAllComponents}
                />
              }
            </div>
            <div className={s.lng}>{bot.language?.value}</div>
          </div>
        </div>
        <div className={s.btns}>
          {type === 'public' ? (
            <>
              <div
                data-tip
                data-tooltip-id={'botClone' + bot?.name}
                className={s.container}
              >
                <Button
                  theme='primary'
                  small
                  long
                  props={{ onClick: handleCloneClick }}
                >
                  {t('card_btns.use')}
                </Button>
              </div>
              <Kebab tooltipId={tooltipId} theme='card' />
              <AssistantContextMenu
                tooltipId={tooltipId}
                bot={bot}
                type={type}
                isDeployed={isDeployed}
              />
            </>
          ) : (
            <>
              <Button
                theme='primary'
                small
                long
                props={{
                  onClick: handlEditClick,
                  disabled: onModeration || isDeploying,
                }}
              >
                {t('card_btns.edit')}
              </Button>
              <Kebab tooltipId={tooltipId} theme='card' />
              <AssistantContextMenu
                tooltipId={tooltipId}
                bot={bot}
                type={type}
                isDeployed={isDeployed}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
