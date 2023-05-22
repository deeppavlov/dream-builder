import { FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
  PublishRequestsStatus,
  VisibilityStatus,
} from '../../constants/constants'
import { useAuth } from '../../context/AuthProvider'
import { usePreview } from '../../context/PreviewProvider'
import { useAssistants } from '../../hooks/useAssistants'
import { useDeploy } from '../../hooks/useDeploy'
import { toasts } from '../../mapping/toasts'
import { visibilityForDropbox } from '../../mapping/visibility'
import { TDistVisibility } from '../../types/types'
import Button from '../../ui/Button/Button'
import { Container } from '../../ui/Container/Container'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { trigger } from '../../utils/events'
import { getAssistantState } from '../../utils/getAssistantState'
import AssistantSidePanel from '../AssistantSidePanel/AssistantSidePanel'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { Details } from '../Details/Details'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import SvgIcon from '../SvgIcon/SvgIcon'

interface Props {}

export const AssistantModule: FC<Props> = () => {
  const { name } = useParams()
  const { isPreview } = usePreview()
  const navigate = useNavigate()
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { getDist, changeVisibility } = useAssistants()
  const { data: bot, isFetched } = getDist({ distName: name!, inEditor: true })
  const { deploy, deleteDeployment, checkDeployStatus } = useDeploy()
  const { onModeration, isDeployed, isDeploying } = getAssistantState(bot)

  checkDeployStatus(bot!)

  const { control, reset } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      visibility: visibilityForDropbox.find(type => type.id === bot?.visibility)
        ?.name,
    },
  })
  const v = useWatch({ control, name: 'visibility' })
  const defaultDropboxValue = visibilityForDropbox.find(
    type => type.id === bot?.visibility
  )?.name

  const error =
    bot?.deployment?.error !== null && bot?.deployment?.error !== undefined
  const currentVisibilityStatus = bot?.visibility

  const handleVisibility = (v: string) => {
    const visibility = visibilityForDropbox.find(type => type.name === v)
      ?.id! as TDistVisibility
    const name = bot?.name!
    const deploymentState = bot?.deployment?.state

    if (
      visibility !== currentVisibilityStatus ||
      bot?.publish_state == PublishRequestsStatus.IN_REVIEW
    ) {
      toast.promise(
        changeVisibility.mutateAsync(
          {
            name,
            visibility,
            inEditor: true,
            deploymentState,
          },
          {
            onSuccess: () => {
              currentVisibilityStatus === VisibilityStatus.PUBLIC_TEMPLATE &&
                queryClient.invalidateQueries('dist')
            },
          }
        ),
        {
          loading: 'Loading...',
          success:
            visibility === VisibilityStatus.PUBLIC_TEMPLATE
              ? 'Submitted For Review!'
              : 'Success!',
          error: 'Something went wrong...',
        }
      )
    }
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
    !isDeployed &&
      !isDeploying &&
      !error &&
      toast.promise(deploy.mutateAsync(bot?.name!), toasts.deploy)

    isDeployed &&
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

  useEffect(() => {
    reset({
      visibility: defaultDropboxValue,
    })
  }, [bot?.visibility])

  useEffect(() => {
    v && handleVisibility(v)
  }, [v])

  useEffect(() => {
    const redirectConditions = isFetched && (onModeration || isDeploying)

    if (redirectConditions) navigate('/')
  }, [bot, isFetched])

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
              Duplicate Assistant
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
                    Build Assistant
                  </>
                )}
                {isDeploying && (
                  <>
                    <SvgIcon iconName='start' />
                    Build Assistant
                  </>
                )}
                {isDeployed && (
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
            <SkillDropboxSearch
              small
              withoutSearch
              name='visibility'
              control={control}
              rules={{ required: true }}
              list={visibilityForDropbox}
              props={{ disabled: isDeploying }}
            />
          )}
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
        </Container>
      </Wrapper>
    </>
  )
}
