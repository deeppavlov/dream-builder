import { ReactComponent as HistoryIcon } from '@assets/icons/history.svg'
import classNames from 'classnames/bind'
import { useEffect,useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import { useMutation,useQuery,useQueryClient } from 'react-query'
import { useDisplay } from '../../context/DisplayContext'
import { useObserver } from '../../hooks/useObserver'
import { servicesList } from '../../mocks/database/servicesList'
import { changeLMservice } from '../../services/changeLMservice'
import { getAllLMservices } from '../../services/getAllLMservices'
import { getLMservice } from '../../services/getLMservice'
import { getPrompt } from '../../services/getPrompt'
import { postPrompt } from '../../services/postPrompt'
import { ISkill } from '../../types/types'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'
import { DEBUG_DIST } from '../DialogSidePanel/DialogSidePanel'
import SkillDialog from '../SkillDialog/SkillDialog'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './SkillPromptModal.module.scss'

export const SKILL_EDITOR_TRIGGER = 'SKILL_EDITOR_TRIGGER'

type TAction = 'create' | 'edit'

interface Props {
  action?: TAction
  skill?: ISkill
  isOpen?: boolean
}

interface FormValues {
  model: string
  prompt: string
}

const SkillPromptModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAction | null>(null)
  const [skill, setSkill] = useState<ISkill | null>(null)
  const queryClient = useQueryClient()
  const { options, dispatch } = useDisplay()
  const dist = options.get(consts.ACTIVE_ASSISTANT)
  const editorActiveTab = options.get(consts.EDITOR_ACTIVE_TAB)
  const leftSidePanelIsActive = options.get(consts.LEFT_SP_IS_ACTIVE)
  const promptWordsMaxLenght = 3000
  const cx = classNames.bind(s)

  const setPromptForDist = useMutation({
    mutationFn: (variables: { distName: string; prompt: string }) => {
      return postPrompt(variables?.distName, variables?.prompt)
    },
    onSuccess: () => queryClient.invalidateQueries('prompt'),
  })

  const setServiceForDist = useMutation({
    mutationFn: (variables: { distName: string; service: string }) => {
      return changeLMservice(variables?.distName, variables?.service)
    },
    onSuccess: () => queryClient.invalidateQueries('lm_service'),
  })

  const setPromptForDebugDist = useMutation({
    mutationFn: (variables: { DEBUG_DIST: string; prompt: string }) => {
      return postPrompt(variables?.DEBUG_DIST, variables?.prompt)
    },
  })

  const setServiceForDebugDist = useMutation({
    mutationFn: (variables: { DEBUG_DIST: string; service: string }) => {
      return changeLMservice(variables?.DEBUG_DIST, variables?.service)
    },
  })

  const { data: services } = useQuery('lm_services', getAllLMservices, {
    refetchOnWindowFocus: false,
  })

  const { data: service } = useQuery(
    ['lm_service', dist?.name],
    () => getLMservice(dist?.name),
    {
      refetchOnWindowFocus: false,
      enabled: dist?.name?.length > 0,
      onSuccess: data => {
        const service = data?.name
        setServiceForDebugDist.mutateAsync({ DEBUG_DIST, service })
      },
    }
  )

  const { data: prompt } = useQuery(
    ['prompt', dist?.name!],
    () => getPrompt(dist?.name),
    {
      refetchOnWindowFocus: false,
      enabled: dist?.name?.length > 0,
      onSuccess: data => {
        const prompt = data?.text
        setPromptForDebugDist.mutateAsync({ DEBUG_DIST, prompt })
      },
    }
  )

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      model: service?.displayName,
      prompt: prompt?.text,
    },
  })
  const model = getValues().model
  const skillModelTip = servicesList.get(model)?.description
  const skillModelLink = servicesList.get(model)?.link

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setSkill(null)
    trigger(SKILL_EDITOR_TRIGGER, { isOpen: false })
  }

  const handleBackBtnClick = () => closeModal()

  const handleEventUpdate = (data: { detail: Props }) => {
    const { skill, action } = data.detail

    if (data.detail.isOpen !== undefined && !data.detail.isOpen) {
      closeModal()
      return
    }

    trigger(SKILL_EDITOR_TRIGGER, { isOpen: true })
    setAction(action ?? 'create')
    setSkill(skill ?? null)
    reset({
      model: skill?.model,
      prompt: skill?.prompt,
    })
    setIsOpen(!isOpen)
  }

  const handleModelSelect = (model: string) => reset({ model })

  const handleCreate = ({ model, prompt }: FormValues) => {
    trigger('CreateSkillDistModal', { ...skill, ...{ model, prompt } })
  }

  const onFormSubmit = (data: FormValues) => {
    if (action === 'create') {
      handleCreate(data)
      return
    }

    // For prompt & model editing
    if (action === 'edit') {
      handleSaveAndTest(data)
    }
  }
  
  async function handleSaveAndTest(data: FormValues) {
    const service = servicesList.get(data.model)?.name!
    const prompt = data.prompt
    const distName = dist?.name
    
    setPromptForDist.mutateAsync({ distName, prompt })
    setServiceForDist.mutateAsync({ distName, service })

    setPromptForDebugDist.mutateAsync({ DEBUG_DIST, prompt })
    setServiceForDebugDist.mutateAsync({ DEBUG_DIST, service })

    reset()
    trigger('RenewChat', {})
  }

  const handleSaveAndClose = () =>
    handleSubmit(handleSaveAndTest)().finally(() => closeModal())

  useObserver('SkillPromptModal', handleEventUpdate)

  useEffect(() => {
    reset({
      model: service?.display_name,
      prompt: prompt?.text,
    })
  }, [service, prompt])

  useEffect(() => {
    dispatch({
      type: 'set',
      option: {
        id: consts.BREADCRUMBS_PATH,
        value: {
          location: location.pathname,
          path: isOpen
            ? [dist?.display_name, 'Skills', skill?.display_name]
            : [dist?.display_name, editorActiveTab],
        },
      },
    })

    dispatch({
      type: 'set',
      option: {
        id: consts.SKILL_EDITOR_IS_ACTIVE,
        value: isOpen,
      },
    })
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{
        overlay: {
          top: 64,
          right: 0,
          left: 80,
          position: 'fixed',
          zIndex: 0,
        },
        content: {
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          transform: 'none',
          height: '100%',
          width: '100%',
          border: 'none',
          background: 'none',
          borderRadius: 0,
          padding: 0,
        },
      }}
    >
      <div className={s.skillPromptModal}>
        <form
          onSubmit={handleSubmit(data => onFormSubmit(data))}
          className={cx('editor', leftSidePanelIsActive && 'withSidePanel')}
        >
          <div className={s.header}>
            {skill?.display_name ?? 'Current Skill'}: Editor
          </div>
          <div className={s['editor-container']}>
            <div className={s.top}>
              <SkillDropboxSearch
                label='Generative model:'
                list={
                  services &&
                  services?.map((service: any) => {
                    return service?.display_name
                  })
                }
                activeItem={service?.display_name}
                error={errors.model}
                props={{
                  placeholder: 'Choose model',
                  ...register('model', { required: true }),
                }}
                onSelect={handleModelSelect}
                fullWidth
              />
              {service?.display_name && (
                <p className={s.tip}>
                  <span className={s['tip-bold']}>Details:</span>
                  <span>{skillModelTip}</span>
                  <a
                    href={skillModelLink}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {skillModelLink}
                  </a>
                  <br />
                </p>
              )}
            </div>
            <TextArea
              fullHeight
              label='Enter prompt:'
              withCounter
              resizable={false}
              error={errors.model}
              maxLenght={promptWordsMaxLenght}
              props={{
                placeholder:
                  "Hello, I'm a SpaceX Starman made by brilliant engineering team at SpaceX to tell you about the future of humanity in space and",
                defaultValue: prompt?.text,
                ...register('prompt', {
                  required: 'This field can’t be empty',
                  maxLength: {
                    value: promptWordsMaxLenght,
                    message: `Limit prompt to ${promptWordsMaxLenght} words`,
                  },
                }),
              }}
            />
          </div>
          <div className={s.bottom}>
            <span className={s['tip-bold']}>
              Click "Save & Test" to test your new prompt
            </span>
            <div className={s.btns}>
              {action === 'create' && (
                <>
                  <Button
                    theme='secondary'
                    props={{ onClick: handleBackBtnClick }}
                  >
                    Back
                  </Button>
                  <Button theme='primary' props={{ type: 'submit' }}>
                    Save
                  </Button>
                </>
              )}
              {action === 'edit' && (
                <>
                  <div className={s.history}>
                    <Button theme='tertiary-round'>
                      <HistoryIcon />
                      History
                    </Button>
                  </div>
                  <Button theme='secondary-dark' props={{ type: 'submit' }}>
                    Save & Test
                  </Button>
                  <Button
                    theme='primary'
                    props={{ onClick: handleSaveAndClose }}
                  >
                    Save & Close
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
        <SkillDialog debug chatWith={'skill'} dist={dist} />
      </div>
    </Modal>
  )
}

export default SkillPromptModal
