import { FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { usePreview } from '../../context/PreviewProvider'
import { useAssistants } from '../../hooks/useAssistants'
import { useDeploy } from '../../hooks/useDeploy'
import { toasts } from '../../mapping/toasts'
import { visibilityForDropbox } from '../../mapping/visibility'
import { getDeploy } from '../../services/getDeploy'
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
  //   const { options } = useDisplay()

  const queryClient = useQueryClient()
  const { getDist, changeVisibility } = useAssistants()
  const { data: bot } = getDist(name!)
  const { deploy, deleteDeployment } = useDeploy()

  const { control, reset, getValues } = useForm({
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

  const deployed = bot?.deployment?.state === 'UP'
  const deploying =
    !deployed && bot?.deployment?.state !== null && bot?.deployment !== null
  const error =
    bot?.deployment?.error !== null && bot?.deployment?.error !== undefined

  const currentVisibilityStatus = bot?.visibility

  //   const isSidePanelActive = options.get(consts.ACTIVE_ASSISTANT_SP_ID)

  const handleVisibility = v => {
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
  useEffect(() => {
    v && handleVisibility(v)
  }, [v])

  const defaultDropboxValue = visibilityForDropbox.find(
    type => type.id === bot?.visibility
  )?.name

  useEffect(() => {
    reset({
      visibility: defaultDropboxValue,
    })
  }, [bot?.visibility])

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
        deleteDeployment.mutateAsync(bot?.deployment?.id!),
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
    trigger('AssistantModal', { bot, action: 'clone' })
  }

  const status = useQuery({
    queryKey: ['deploy', bot?.deployment?.id],
    queryFn: () => getDeploy(bot?.deployment?.id!),
    refetchOnMount: false,
    enabled: bot?.deployment?.id !== undefined,
    onSuccess(data) {
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
              name='visibility'
              control={control}
              rules={{ required: true }}
              list={visibilityForDropbox}
              fullWidth
            />
          )}
          {!isPreview && (
            <Button props={{ onClick: handleShare }} withIcon theme='tertiary2'>
              <SvgIcon iconName='share' />
            </Button>
          )}
        </Container>
      </Wrapper>
    </>
  )
}
