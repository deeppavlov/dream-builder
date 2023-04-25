import { ReactComponent as HistoryIcon } from '@assets/icons/history.svg'
import classNames from 'classnames/bind'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { DEBUG_DIST } from '../../constants/constants'
import { useDisplay } from '../../context/DisplayContext'
import { useObserver } from '../../hooks/useObserver'
import { useQuitConfirmation } from '../../hooks/useQuitConfirmation'
import { changeLMservice } from '../../services/changeLMservice'
import { getAllLMservices } from '../../services/getAllLMservices'
import { getLMservice } from '../../services/getLMservice'
import { getPrompt } from '../../services/getPrompt'
import { postPrompt } from '../../services/postPrompt'
import { ISkill } from '../../types/types'
import { Accordion } from '../../ui/Accordion/Accordion'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'
import { validationSchema } from '../../utils/validationSchema'
import { HELPER_TAB_ID } from '../Sidebar/components/DeepyHelperTab'
import SkillDialog from '../SkillDialog/SkillDialog'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './SkillPromptModal.module.scss'

export const SKILL_EDITOR_TRIGGER = 'SKILL_EDITOR_TRIGGER'

type TAction = 'create' | 'edit'
interface LM {
  name: string
  display_name: string
  description: string
  max_tokens: number
  size: string
  project_url: string
  id: number
}
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
  const [selectedService, setSelectedService] = useState<LM | null>(null)
  const queryClient = useQueryClient()
  const { options, dispatch } = useDisplay()
  const dist = options.get(consts.ACTIVE_ASSISTANT)
  const editorActiveTab = options.get(consts.EDITOR_ACTIVE_TAB)
  const leftSidePanelIsActive = options.get(consts.LEFT_SP_IS_ACTIVE)
  const modalRef = useRef(null)
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

  const createMap = (array: LM[]) => {
    const map = new Map<string, LM>()
    array?.forEach((object: LM) => {
      const { display_name } = object
      map.set(display_name, { ...object })
    })
    return map
  }

  const servicesList = createMap(services)

  const { data: service } = useQuery(
    ['lm_service', dist?.name],
    () => getLMservice(dist?.name),
    {
      refetchOnWindowFocus: false,
      enabled: dist?.name?.length > 0,
      onSuccess: data => {
        const service = data?.name
        setSelectedService(data)
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
    setValue,
    setError,
    getValues,
    control,
    formState,
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      model: service?.displayName,
      prompt: prompt?.text,
    },
  })
  const { errors } = formState
  const model = getValues().model
  const skillModelTip = servicesList.get(model)?.description
  const skillModelLink = servicesList.get(model)?.project_url

  const closeModal = () => {
    trigger('SkillQuitModal', {
      handleQuit: () => {
        setIsOpen(false)
        setAction(null)
        setSkill(null)
        trigger(SKILL_EDITOR_TRIGGER, { isOpen: false })
      },
    })
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

  const handleModelSelect = ({ name, data }: any) => {
    setValue('model', name)
    setSelectedService(services?.find((s: LM) => s?.name === data))
  }

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
    console.log('service = ', service)
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

  useQuitConfirmation({
    activeElement: modalRef,
    availableSelectors: [`#${HELPER_TAB_ID}`, `#sp_left`],
    isActive: isOpen,
    quitHandler: closeModal,
  })

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
          background: 'transparent',
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
      <div
        className={cx(
          'skillPromptModal',
          leftSidePanelIsActive && 'withSidePanel'
        )}
        ref={modalRef}
      >
        <Wrapper
          closable
          onClose={e => {
            e.stopImmediatePropagation()
            closeModal()
          }}
        >
          <div className={s.container}>
            <form
              onSubmit={handleSubmit(data => onFormSubmit(data))}
              className={cx('editor')}
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
                      services?.map((service: any) => ({
                        name: service?.display_name,
                        data: service?.name,
                      }))
                    }
                    activeItem={{
                      name: service?.display_name,
                    }}
                    error={errors.model}
                    props={{
                      placeholder: 'Choose model',
                      defaultValue: service?.display_name,
                      ...register('model', { required: true }),
                    }}
                    onSelect={handleModelSelect}
                    fullWidth
                  />
                  {service?.display_name && (
                    <div>
                      <Accordion
                        title='Model Details:'
                        type='description'
                        isActive
                      >
                        <p className={s.tip}>
                          <span>{skillModelTip}</span>
                          <a
                            href={skillModelLink}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {skillModelLink}
                          </a>
                        </p>
                      </Accordion>
                    </div>
                  )}
                </div>
                <TextArea
                  name='prompt'
                  label='Enter prompt:'
                  countType='tokenizer'
                  tokenizerModel={selectedService?.display_name as any}
                  defaultValue={prompt?.text}
                  withCounter
                  fullHeight
                  resizable={false}
                  control={control}
                  rules={{
                    required: validationSchema.global.required,
                    maxLength:
                      selectedService?.max_tokens &&
                      validationSchema.skill.prompt.maxLength(
                        selectedService?.max_tokens
                      ),
                    pattern: validationSchema.global.engSpeechRegExp,
                  }}
                  setError={setError}
                  props={{
                    placeholder:
                      "Hello, I'm a SpaceX Starman made by brilliant engineering team at SpaceX to tell you about the future of humanity in space and",
                  }}
                />
              </div>
              <div className={s.bottom}>
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
                      <Button theme='tertiary-round' props={{ disabled: true }}>
                        <HistoryIcon />
                        History
                      </Button>
                      <Button theme='primary' props={{ type: 'submit' }}>
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </form>

            <div className={s.dialog}>
              <SkillDialog debug chatWith={'skill'} dist={dist} />
            </div>
          </div>
        </Wrapper>
      </div>
    </Modal>
  )
}

export default SkillPromptModal
