import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import classNames from 'classnames/bind'
import { ReactComponent as HistoryIcon } from '@assets/icons/history.svg'
import { BotInfoInterface, ISkill } from '../../types/types'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import { DEBUG_DIST } from '../DialogSidePanel/DialogSidePanel'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getLMservice } from '../../services/getLMservice'
import { getPrompt } from '../../services/getPrompt'
import { getAllLMservices } from '../../services/getAllLMservices'
import { HELPER_SIDEPANEL_TRIGGER } from '../HelperDialogSidePanel/HelperDialogSidePanel'
import SkillDialog from '../SkillDialog/SkillDialog'
import { postPrompt } from '../../services/postPrompt'
import { changeLMservice } from '../../services/changeLMservice'
import { servicesList } from '../../mocks/database/servicesList'
import s from './SkillPromptModal.module.scss'

export const SKILL_EDITOR_TRIGGER = 'SKILL_EDITOR_TRIGGER'

type TAction = 'create' | 'edit'

interface Props {
  dist: BotInfoInterface
  action?: TAction
  skill?: ISkill
  isOpen?: boolean
  distName: string
  dialogHandler?: () => void
  withLeftPadding?: boolean
}

const SkillPromptModal: FC<Props> = ({
  dist,
  distName,
  withLeftPadding = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAction | null>(null)
  const [skill, setSkill] = useState<ISkill | null>(null)
  const queryClient = useQueryClient()
  const cx = classNames.bind(s)

  const [withSidePanel, setWithSidePanel] = useState(withLeftPadding)
  const [MODEL_ID, PROMPT_ID] = ['model', 'prompt']
  const promptWordsMaxLenght = 3000

  // queries

  const setPromptForDist = useMutation({
    mutationFn: (variables: { distName: string; prompt: string }) => {
      return postPrompt(variables?.distName, variables?.prompt)
    },
    onSuccess: data => {
      queryClient.invalidateQueries('prompt')
    },
  })
  const setServiceForDist = useMutation({
    mutationFn: (variables: { distName: string; service: string }) => {
      return changeLMservice(variables?.distName, variables?.service)
    },
    onSuccess: data => {
      queryClient.invalidateQueries('lm_service')
    },
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

  const { data: services } = useQuery('lm_services', getAllLMservices)

  const { data: service } = useQuery(
    ['lm_service', dist?.name],
    () => getLMservice(distName || dist?.name),
    {
      enabled: dist?.name?.length > 0,
      onSuccess: data => {
        const service = data?.service
        setServiceForDebugDist.mutateAsync({ DEBUG_DIST, service })
      },
    }
  )
  const { data: prompt } = useQuery(
    ['prompt', dist?.name!],
    () => getPrompt(distName || dist?.name),
    {
      onSuccess: data => {
        const prompt = data?.text
        setPromptForDebugDist.mutateAsync({ DEBUG_DIST, prompt })
      },
    }
  )

  //

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      MODEL_ID: service?.displayName,
      PROMPT_ID: prompt?.text,
    },
  })
  const model = getValues()[MODEL_ID] as string
  const skillModelTip = servicesList.get(model)?.description
  const skillModelLink = servicesList.get(model)?.link
  const skillModelName = servicesList.get(model)?.name
  
  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setSkill(null)
    trigger(SKILL_EDITOR_TRIGGER, { isOpen: false })
    history.pushState(
      Object.assign({}, history.state, { dialogSkillName: null }),
      '',
      location.pathname
    )
  }

  const handleBackBtnClick = () => closeModal()

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = (data: { detail: Props }) => {
    const { skill, action, dist } = data.detail

    if (data.detail.isOpen !== undefined && !data.detail.isOpen) {
      closeModal()
      return
    }

    // Push skill name for breadcrumbs bar
    history.pushState(
      Object.assign({}, history.state, {
        dialogSkillName: skill?.display_name,
      }),
      '',
      location.pathname
    )
    trigger(SKILL_EDITOR_TRIGGER, { isOpen: true })

    setAction(action ?? 'create')
    setSkill(skill ?? null)

    reset({
      [MODEL_ID]: skill?.model,
      [PROMPT_ID]: skill?.prompt,
    })
    setIsOpen(!isOpen)
  }

  const handleModelSelect = (model: string) => {
    reset({
      [MODEL_ID]: model,
    })
  }

  const handleCreate = (data: any) => {
    const newSkill = {
      ...skill,
      ...{ model: data[MODEL_ID], prompt: data[PROMPT_ID] },
    }
    trigger('CreateSkillDistModal', newSkill)
  }

  const onFormSubmit = (data: any, afterClose?: boolean) => {
    if (action === 'create') {
      handleCreate(data)
      return
    }

    // For prompt & model editing
    if (action === 'edit') {
      handleSaveAndTest(data)
    }
  }

  async function handleSaveAndTest(data: { prompt: string }) {
    const service = servicesList.get(model)?.name!
    const prompt = data?.prompt
    const distName = dist?.name

    setPromptForDist.mutateAsync({ distName, prompt })
    setServiceForDist.mutateAsync({ distName, service })

    setPromptForDebugDist.mutateAsync({ DEBUG_DIST, prompt })
    setServiceForDebugDist.mutateAsync({ DEBUG_DIST, service })

    reset()
    trigger('RenewChat', {})
  }

  const handleSaveAndClose = () => {
    handleSubmit(handleSaveAndTest)()
      .then(() => {
        closeModal()
      })
      .catch(e => {
        console.log(`e = `, e)
        closeModal()
      })
  }

  const handleLeftSidePanelTrigger = (data: {
    detail: { isOpen: boolean }
  }) => {
    setWithSidePanel(data.detail?.isOpen ?? false)
  }
  useEffect(() => {
    reset({
      MODEL_ID: service?.display_name,
      PROMPT_ID: prompt?.text,
    })
  }, [service, prompt])

  useEffect(() => {
    subscribe('SkillPromptModal', handleEventUpdate)
    // Handle Deepy Helper opening
    subscribe(HELPER_SIDEPANEL_TRIGGER, handleLeftSidePanelTrigger)

    return () => {
      unsubscribe('SkillPromptModal', handleEventUpdate)
      unsubscribe(HELPER_SIDEPANEL_TRIGGER, handleLeftSidePanelTrigger)
      history.pushState(
        Object.assign({}, history.state, { dialogSkillName: null }),
        '',
        location.pathname
      )
    }
  }, [])
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={SkillPromptModal}>
      <div className={s.skillPromptModal}>
        <form
          onSubmit={handleSubmit(data => onFormSubmit(data))}
          className={cx('editor', withSidePanel && 'withSidePanel')}>
          <div className={s.header}>
            {skill?.display_name ?? 'Current Skill'}: Editor
          </div>
          <div className={s['editor-container']}>
            <div className={s.top}>
              <SkillDropboxSearch
                label='Generative model:'
                list={
                  services &&
                  services?.map(service => {
                    return service?.display_name
                  })
                }
                activeItem={service?.display_name}
                error={errors[MODEL_ID]}
                props={{
                  placeholder: 'Choose model',
                  ...register(MODEL_ID, { required: true }),
                }}
                onSelect={handleModelSelect}
                fullWidth
              />
              {model?.length > 0 && (
                <p className={s.tip}>
                  <span className={s['tip-bold']}>Details:</span>
                  <span>{skillModelTip}</span>
                  <a
                    href={skillModelLink}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {skillModelLink}
                  </a>
                  <br />
                </p>
              )}
            </div>

            <TextArea
              label='Enter prompt:'
              withCounter
              error={errors[PROMPT_ID]}
              maxLenght={promptWordsMaxLenght}
              props={{
                defaultValue: prompt?.text,
                ...register(PROMPT_ID, {
                  required: 'This field can’t be empty',
                  maxLength: {
                    value: promptWordsMaxLenght,
                    message: `Limit prompt to ${promptWordsMaxLenght} words`,
                  },
                }),
              }}
            />
            <div className={s.bottom}>
              <span className={s['tip-bold']}>
                Click "Save & Test" to test your new prompt
              </span>
              <div className={s.btns}>
                {action === 'create' && (
                  <>
                    <Button
                      theme='secondary'
                      props={{ onClick: handleBackBtnClick }}>
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
                      props={{ onClick: handleSaveAndClose }}>
                      Save & Close
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
        <SkillDialog debug chatWith={'skill'} dist={dist} />
      </div>
    </Modal>
  )
}

export default SkillPromptModal
