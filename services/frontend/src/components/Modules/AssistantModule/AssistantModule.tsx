import { useAuth } from 'context'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { TDistVisibility } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants, useDeploy } from 'hooks/api'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { useGaPublication } from 'hooks/googleAnalytics/useGaPublication'
import { trigger } from 'utils/events'
import { getAssistantState } from 'utils/getAssistantState'
import { Button } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { AssistantSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Container, Details, SmallTag, Wrapper } from 'components/UI'

export const AssistantModule = () => {
  const { name } = useParams()
  const { isPreview } = usePreview()
  const navigate = useNavigate()
  const auth = useAuth()
  const { t } = useTranslation()
  const { getDist, changeVisibility } = useAssistants()
  const {
    createVaClick,
    vaPropsOpened,
    vaArchitectureOpened,
    vaChangeDeployClick,
  } = useGaAssistant()
  const { visibilityVaButtonClick } = useGaPublication()
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

    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: true,
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
    vaChangeDeployClick('va_control_block', isDeployed)

    !isDeployed &&
      !isDeploying &&
      !error &&
      toast.promise(deploy.mutateAsync(bot?.name!), toasts().deploy)

    isDeployed &&
      toast.promise(
        deleteDeployment.mutateAsync(bot!, {
          onSuccess: () => {
            const visibility: TDistVisibility =
              VISIBILITY_STATUS.PRIVATE as TDistVisibility
            if (bot?.visibility !== VISIBILITY_STATUS.PRIVATE) {
              changeVisibility.mutateAsync(
                { name: bot?.name || '', visibility },
                {
                  onSuccess: data => {
                    console.log('data = ', data)
                  },
                }
              )
            }
          },
        }),
        toasts().deleteDeployment
      )

    error &&
      toast.promise(
        deleteDeployment.mutateAsync(bot),
        toasts().deleteDeployment
      )
  }
  const handleShare = () => {
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
      })

    trigger('AssistantModal', { bot, action: 'clone' })
  }

  useEffect(() => {
    const redirectConditions = isFetched && (onModeration || isDeploying)

    if (redirectConditions) navigate('/')
  }, [bot, isFetched])

  useEffect(() => {
    bot && vaArchitectureOpened(bot)
  }, [bot])

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
              <Button
                loader={isDeploying}
                theme={!error ? 'purple' : 'error'}
                props={{
                  onClick: handleBuild,
                  disabled: deleteDeployment?.isLoading || deploy?.isLoading,
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
