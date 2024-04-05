import { useAuth, useUIOptions } from 'context'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import { TDistVisibility } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants, useComponent, useDeploy } from 'hooks/api'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { useGaEvents } from 'hooks/googleAnalytics/useGaEvents'
import { useGaPublication } from 'hooks/googleAnalytics/useGaPublication'
import { examinationMessage } from 'utils/checkingAssistants'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { getAssistantState } from 'utils/getAssistantState'
import { Button } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { AssistantSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Container, Details, SmallTag, Wrapper } from 'components/UI'

export const AssistantModule = () => {
  const { getAllComponents } = useComponent()
  const { name } = useParams()
  const { isPreview } = usePreview()
  const navigate = useNavigate()
  const auth = useAuth()
  const { t } = useTranslation()
  const { getDist, changeVisibility } = useAssistants()
  const { UIOptions } = useUIOptions()
  const {
    createVaClick,
    vaPropsOpened,
    vaArchitectureOpened,
    vaChangeDeployState,
  } = useGaAssistant()
  const { visibilityVaButtonClick } = useGaPublication()
  const { shareVaButtonClick } = useGaEvents()
  const { data: bot, isFetched } = getDist(
    { distName: name! },
    { refetchOnMount: true }
  )
  const { deploy, deleteDeployment, checkDeployStatus } = useDeploy()
  const { onModeration, isDeployed, isDeploying } = getAssistantState(bot)

  checkDeployStatus(bot!)

  const error =
    bot?.deployment?.error !== null && bot?.deployment?.error !== undefined

  const published = bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
  const privateAssistant = bot?.visibility === VISIBILITY_STATUS.PRIVATE
  const unlistedAssistant = bot?.visibility === VISIBILITY_STATUS.UNLISTED_LINK

  const publishState = onModeration
    ? t('assistant_visibility.on_moderation')
    : published
    ? t('assistant_visibility.public_template')
    : unlistedAssistant
    ? t('assistant_visibility.unlisted')
    : privateAssistant
    ? t('assistant_visibility.private')
    : null

  const handleVisibility = () => {
    visibilityVaButtonClick('va_control_block', bot)
    trigger('PublishAssistantModal', { bot })
  }

  const handleInfo = () => {
    vaPropsOpened('va_control_block', bot)
    const activeAssistantId = UIOptions[consts.ACTIVE_ASSISTANT_SP_ID]
    const infoSPId = `info_${bot?.id}`

    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: activeAssistantId !== infoSPId,
      children: (
        <AssistantSidePanel
          type={
            bot?.visibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE
              ? 'public'
              : 'your'
          } //FIX
          key={bot?.id}
          name={bot?.name!}
        />
      ),
    })
  }
  const handleBuild = () => {
    !isDeployed &&
      !isDeploying &&
      !error &&
      toast
        .promise(deploy.mutateAsync(bot?.name!), toasts().deploy)
        .then(() => vaChangeDeployState('VA_Deployed', 'va_control_block'))

    isDeployed &&
      toast.promise(
        deleteDeployment
          .mutateAsync(bot!, {
            onSuccess: () => {
              changeVisibility.mutateAsync(
                {
                  name: bot?.name || '',
                  newVisibility: VISIBILITY_STATUS.PRIVATE,
                },
                {
                  onSuccess: data => {
                    console.log('data = ', data)
                  },
                }
              )
            },
          })
          .then(() => vaChangeDeployState('VA_Undeployed', 'va_control_block')),
        toasts().deleteDeployment
      )

    error &&
      toast.promise(
        deleteDeployment
          .mutateAsync(bot)
          .then(() => vaChangeDeployState('VA_Undeployed', 'va_control_block')),
        toasts().deleteDeployment
      )
  }
  const handleShare = () => {
    shareVaButtonClick('va_control_block', bot)
    trigger('ShareAssistantModal', { bot })
  }
  const handleDuplicate = () => {
    createVaClick('va_control_block', bot)

    if (!auth?.user)
      return trigger('SignInModal', {
        requestModal: {
          name: 'AssistantModal',
          options: { action: 'clone', bot: bot },
        },
        msg: <Trans i18nKey='modals.sign_in.build' />,
      })

    trigger('AssistantModal', { bot, action: 'clone' })
  }

  useEffect(() => {
    const isAdmin = auth.user?.role.id === 2 || auth.user?.role.id === 3
    const redirectConditions =
      isFetched && (onModeration || isDeploying) && !isAdmin

    if (redirectConditions) navigate('/')
  }, [bot, isFetched])

  useEffect(() => {
    bot && vaArchitectureOpened(bot)
  }, [bot])

  const components = getAllComponents(bot?.name || '', {
    refetchOnMount: true,
  })

  const resultExamination = examinationMessage(components)

  const isPreviewTooltip = resultExamination.status !== 'success'

  return (
    <>
      <Wrapper
        title={bot?.display_name}
        primary
        badge={isDeployed}
        btns={
          <Container>
            <Button withIcon theme='tertiary2' props={{ onClick: handleInfo }}>
              <SvgIcon iconName='properties' />
            </Button>
            <Button
              withIcon
              theme='tertiary2'
              props={{ onClick: handleDuplicate }}
            >
              <SvgIcon iconName='clone' />
              {t('assistant_page.module.btns.duplicate')}
            </Button>
            {!isPreview && (
              <div
                data-tooltip-id={`tooltip`}
                data-tooltip-content={resultExamination.message}
                data-tooltip-variant={resultExamination.status}
                data-tooltip-place='bottom'
              >
                {isPreviewTooltip && (
                  <Tooltip style={{ zIndex: 1, opacity: 1 }} id={`tooltip`} />
                )}
                <Button
                  loader={isDeploying}
                  theme={!error ? 'purple' : 'error'}
                  props={{
                    onClick: handleBuild,
                    disabled:
                      deleteDeployment?.isLoading ||
                      deploy?.isLoading ||
                      resultExamination.isError,
                  }}
                >
                  {!bot?.deployment && (
                    <>
                      <SvgIcon iconName='start' />
                      {t('assistant_page.module.btns.build')}
                    </>
                  )}
                  {isDeploying && (
                    <>
                      <SvgIcon iconName='start' />
                      {t('assistant_page.module.btns.build')}
                    </>
                  )}
                  {isDeployed && (
                    <>
                      <SvgIcon iconName='stop' />
                      {t('assistant_page.module.btns.stop')}
                    </>
                  )}
                  {error && (
                    <>
                      <SvgIcon iconName='restart' />
                      {t('assistant_page.module.btns.restart')}
                    </>
                  )}
                </Button>
              </div>
            )}
          </Container>
        }
      >
        <Container overflowVisible>
          <Details>{bot?.description!}</Details>
          <div
            style={{
              minWidth: 489,
              display: 'flex',
              gap: 16,
              justifyContent: 'flex-end',
            }}
          >
            {!isPreview && (
              <Button
                props={{
                  onClick: handleShare,
                  disabled: bot?.visibility == VISIBILITY_STATUS.PRIVATE,
                }}
                withIcon
                theme='tertiary2'
              >
                <SvgIcon iconName='share' />
              </Button>
            )}
            {!isPreview && (
              <Button
                theme='tertiary2'
                props={{
                  onClick: handleVisibility,
                  disabled: isDeploying,
                }}
              >
                <SvgIcon iconName='publish' />
                {t('assistant_page.module.btns.visibility')}
              </Button>
            )}
          </div>
        </Container>
        <Container flexEnd>
          <SmallTag theme={onModeration ? 'validating' : bot?.visibility}>
            {publishState}
          </SmallTag>
        </Container>
      </Wrapper>
    </>
  )
}
