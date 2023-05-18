import { FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { usePreview } from '../../context/PreviewProvider'
import { useAssistants } from '../../hooks/useAssistants'
import { useDeploy } from '../../hooks/useDeploy'
import { toasts } from '../../mapping/toasts'
import { visibilityForDropbox } from '../../mapping/visibility'
import Button from '../../ui/Button/Button'
import { Container } from '../../ui/Container/Container'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { trigger } from '../../utils/events'
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
  const { data: bot } = getDist({ distName: name! })
  const { deploy, deleteDeployment, checkDeployStatus } = useDeploy()
  checkDeployStatus(bot!)

  const { control, reset } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      visibility: visibilityForDropbox.find(type => type.id === bot?.visibility)
        ?.name,
    },
  })
  const v = useWatch({
    control,
    name: 'visibility',
  })
  const defaultDropboxValue = visibilityForDropbox.find(
    type => type.id === bot?.visibility
  )?.name

  const deployed = bot?.deployment?.state === 'UP'
  const deploying =
    !deployed && bot?.deployment?.state !== null && bot?.deployment !== null
  const error =
    bot?.deployment?.error !== null && bot?.deployment?.error !== undefined

  const onModeration = bot?.publish_state === 'in_progress'

  const currentVisibilityStatus = bot?.visibility

  const handleVisibility = (v: string) => {
    const visibility = visibilityForDropbox.find(type => type.name === v)?.id!
    const name = bot?.name!
    const deploymentState = bot?.deployment?.state

    if (
      visibility !== currentVisibilityStatus ||
      bot?.publish_state == 'in_progress'
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
              currentVisibilityStatus === 'public_template' &&
                queryClient.invalidateQueries('dist')
            },
          }
        ),
        {
          loading: 'Loading...',
          success:
            visibility === 'public_template'
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
          type={bot?.visibility === 'public_template' ? 'public' : 'your'}
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
            const visibility = 'private'
            if (bot?.visibility !== 'private') {
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
    const redirectConditions = !auth?.user! || onModeration
    if (bot && redirectConditions) {
      navigate('/')
    }
  }, [bot])

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
            <SkillDropboxSearch
              withoutSearch
              name='visibility'
              control={control}
              rules={{ required: true }}
              list={visibilityForDropbox}
              props={{ disabled: deploying }}
              // fullWidth
              small
            />
          )}
          {!isPreview && (
            <Button
              props={{
                onClick: handleShare,
                disabled: bot?.visibility == 'private',
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
