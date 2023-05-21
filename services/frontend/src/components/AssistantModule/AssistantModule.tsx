import { FC, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import {
  PublishRequestsStatus,
  VisibilityStatus,
} from '../../constants/constants'
import { useAuth } from '../../context/AuthProvider'
import { usePreview } from '../../context/PreviewProvider'
import { useAssistants } from '../../hooks/useAssistants'
import { useCheckIsAdmin } from '../../hooks/useCheckIsAdmin'
import { useDeploy } from '../../hooks/useDeploy'
import { toasts } from '../../mapping/toasts'
import { TDistVisibility } from '../../types/types'
import Button from '../../ui/Button/Button'
import { Container } from '../../ui/Container/Container'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { trigger } from '../../utils/events'
import AssistantSidePanel from '../AssistantSidePanel/AssistantSidePanel'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { Details } from '../Details/Details'
import { SmallTag } from '../SmallTag/SmallTag'
import SvgIcon from '../SvgIcon/SvgIcon'

interface Props {}

export const AssistantModule: FC<Props> = () => {
  const { name } = useParams()
  const { isPreview } = usePreview()
  const navigate = useNavigate()
  const auth = useAuth()

  const { getDist, changeVisibility } = useAssistants()
  const { data: bot, isFetched } = getDist({ distName: name!, inEditor: true })
  const { deploy, deleteDeployment, checkDeployStatus } = useDeploy()

  checkDeployStatus(bot!)

  const deployed = bot?.deployment?.state === 'UP' //FIX
  const deploying =
    !deployed && bot?.deployment?.state !== null && bot?.deployment !== null
  const error =
    bot?.deployment?.error !== null && bot?.deployment?.error !== undefined

  const onModeration = bot?.publish_state === PublishRequestsStatus.IN_REVIEW

  const published = bot?.visibility === VisibilityStatus.PUBLIC_TEMPLATE
  const privateAssistant = bot?.visibility === VisibilityStatus.PRIVATE
  const unlistedAssistant = bot?.visibility === VisibilityStatus.UNLISTED_LINK

  const publishState = onModeration
    ? 'On Moderation'
    : published
    ? 'Public Template'
    : unlistedAssistant
    ? 'Unlisted'
    : privateAssistant
    ? 'Private'
    : null

  const handleVisibility = () => {
    trigger('PublishAssistantModal', { bot })
  }

  const handleInfo = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: true,
      children: (
        <AssistantSidePanel
          type={
            bot?.visibility === VisibilityStatus.PUBLIC_TEMPLATE
              ? 'public'
              : 'your'
          } //FIX
          key={bot?.id}
          name={bot?.name!}
          fromEditor
        />
      ),
    })
  }
  const handleBuild = () => {
    !deployed &&
      !deploying &&
      !error &&
      toast.promise(deploy.mutateAsync(bot?.name!), toasts.deploy)

    deployed &&
      toast.promise(
        deleteDeployment.mutateAsync(bot?.deployment?.id!, {
          onSuccess: () => {
            const name = bot?.name
            const visibility: TDistVisibility =
              VisibilityStatus.PRIVATE as TDistVisibility
            if (bot?.visibility !== VisibilityStatus.PRIVATE) {
              changeVisibility.mutateAsync(
                { name, visibility },
                {
                  onSuccess: data => {
                    console.log('data = ', data)
                  },
                }
              )
            }
          },
        }),
        toasts.deleteDeployment
      )

    error &&
      toast.promise(
        deleteDeployment.mutateAsync(bot?.deployment?.id!),
        toasts.deleteDeployment
      )
  }
  const handleShare = () => {
    trigger('ShareModal', { bot })
  }
  const handleDuplicate = () => {
    if (!auth?.user)
      return trigger('SignInModal', {
        requestModal: {
          name: 'AssistantModal',
          options: { action: 'clone', bot: bot },
        },
      })

    trigger('AssistantModal', { bot, action: 'clone' })
  }

  const { isAdmin } = useCheckIsAdmin()

  useEffect(() => {
    const redirectConditions = isFetched && (onModeration || deploying)

    if (redirectConditions) navigate('/')
  }, [bot, isFetched])

  return (
    <>
      <Wrapper
        title={bot?.display_name}
        primary
        badge={deployed}
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
              Duplicate Assistant
            </Button>
            {!isPreview && (
              <Button
                loader={deploying}
                theme={!error ? 'purple' : 'error'}
                props={{
                  onClick: handleBuild,
                  disabled: deleteDeployment?.isLoading || deploy?.isLoading,
                }}
              >
                {!bot?.deployment && (
                  <>
                    <SvgIcon iconName='start' />
                    Build Assistant
                  </>
                )}
                {deploying && (
                  <>
                    <SvgIcon iconName='start' />
                    Build Assistant
                  </>
                )}
                {deployed && (
                  <>
                    <SvgIcon iconName='stop' />
                    Stop Assistant
                  </>
                )}
                {error && (
                  <>
                    <SvgIcon iconName='restart' />
                    Restart Assistant
                  </>
                )}
              </Button>
            )}
          </Container>
        }
      >
        <Container overflowVisible>
          <Details>{bot?.description!}</Details>
          {!isPreview && (
            <Button
              props={{
                onClick: handleShare,
                disabled: bot?.visibility == VisibilityStatus.PRIVATE,
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
                disabled: deploying,
              }}
            >
              <SvgIcon iconName='publish' />
              Visibility
            </Button>
          )}
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
