import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import { ReactComponent as HistoryIcon } from '@assets/icons/history.svg'
import { BotInfoInterface, ISkill } from '../../types/types'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import DialogSidePanel, { DEBUG_DIST } from '../DialogSidePanel/DialogSidePanel'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getLMservice } from '../../services/getLMservice'
import { getPrompt } from '../../services/getPrompt'
import { getAllLMservices } from '../../services/getAllLMservices'
import s from './SkillPromptModal.module.scss'
import { postPrompt } from '../../services/postPrompt'
import { changeLMservice } from '../../services/changeLMservice'

const mockSkillModels = new Map([
  [
    'ChatGPT',
    {
      description:
        'ChatGPT is the GPT-3.5 model optimized for chat at 1/10th the cost of text-davinci-003. ChatGPT is available as gpt-3.5-turbo in OpenAI API on a paid basis and requiring an individual API key. It contains 175 billion parameters. ChatGPT accepts at maximum 4,096 tokens.',
      link: 'https://chat.openai.com/',
      name: 'openai-api-chatgpt',
    },
  ],
  [
    'GPT-3.5',
    {
      description:
        'GPT-3.5 is a language model available as text-davinci-003 in OpenAI API on a paid basis and requiring an individual API key. It contains 175 billion parameters. GPT-3.5 accepts at maximum 4,097 tokens.',
      link: 'https://beta.openai.com/playground',
      name: 'openai-api-davinci3',
    },
  ],
  [
    'GPT-J 6B',
    {
      description:
        'GPT-J 6B is an open-source language model from transformers. It contains 6 billion parameters, and is 30 times smaller than GPT-3 175B while having a comparable generation quality. GPT-J 6B accepts at maximum 2,048 tokens.',
      link: 'https://huggingface.co/EleutherAI/gpt-j-6B',
      name: 'transformers-lm-gptj',
    },
  ],
  [
    'BLOOMZ 7B',
    {
      description:
        'BLOOMZ 7B is an open-source multilingual language model from transformers. It contains 7.1 billion parameters. BLOOMZ 7B accepts at maximum 2,048 tokens.',
      link: 'https://huggingface.co/bigscience/bloomz-7b1',
      name: 'transformers-lm-bloomz7b',
    },
  ],
])

type TAction = 'create' | 'edit'

interface Props {
  dist: BotInfoInterface
  action?: TAction
  skill?: ISkill
  isOpen?: boolean
  distName: string
  dialogHandler?: () => void
  handleClose?: () => void
}

const SkillPromptModal = ({
  dialogHandler,
  handleClose,
  dist,
  distName,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAction | null>(null)
  const [skill, setSkill] = useState<ISkill | null>(null)
  const queryClient = useQueryClient()
  const {
    data: services,
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useQuery('lm_services', getAllLMservices)
  const {
    data: service,
    isLoading: isServiceLoading,
    isError: isServiceError,
  } = useQuery(['lm_service', dist?.name], () =>
    getLMservice(distName || dist?.name)
  )
  const {
    data: prompt,
    isLoading: isPromptLoading,
    isError: isPromptError,
  } = useQuery(['prompt', dist?.name!], () => getPrompt(distName || dist?.name))

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    mode: 'all',
    defaultValues: {
      MODEL_ID: service?.displayName,
      PROMPT_ID: prompt?.text,
    },
  })
  const [MODEL_ID, PROMPT_ID] = ['model', 'prompt']
  const promptWordsMaxLenght = 3000
  const model = getValues()[MODEL_ID] as string

  const skillModelTip = mockSkillModels.get(model)?.description
  const skillModelLink = mockSkillModels.get(model)?.link
  const skillModelName = mockSkillModels.get(model)?.name

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setSkill(null)

    trigger(BASE_SP_EVENT, { isOpen: false, withTransition: false })
    trigger('HelperDialogSidePanel', { isOpen: false })

    handleClose && handleClose()
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
      { dialogSkillId: skill?.display_name },
      '',
      location.pathname
    )

    // if (dialogHandler) dialogHandler()

    trigger(BASE_SP_EVENT, {
      children: (
        <DialogSidePanel
          debug
          dist={dist}
          key={skill?.name}
          chatWith='skill'
          start
        />
      ),
      withTransition: false,
      isClosable: false,
    })

    trigger('HelperDialogSidePanel', {})

    setAction(action ?? 'create')
    setSkill(skill ?? null)
    // Reset values and errors states
    // reset({
    //   [MODEL_ID]: skill?.model,
    //   [PROMPT_ID]: skill?.prompt,
    // })
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
    console.log(`data in form submit = `, data)
    if (action === 'create') {
      handleCreate(data)
      return
    }

    // For prompt & model editing
    if (action === 'edit') {
      handleSaveAndTest(data)
    }

    // if (afterClose) closeModal()
  }
  const handleSaveAndTest = data => {
    const service = mockSkillModels.get(model).name
    const prompt = data?.prompt
    const distName = dist?.name
    

    setPromptForDist.mutate({ distName, prompt })
    setServiceForDist.mutate({ distName, service })
    
    setPromptForDebugDist.mutate({ DEBUG_DIST, prompt })
    setServiceForDebugDist.mutate({ DEBUG_DIST, service })

    reset()
  }

  const setPromptForDist = useMutation({
    mutationFn: (variables: { distName: string; prompt: string }) => {
      return postPrompt(variables?.distName, variables?.prompt)
    },
    onSuccess: data => {
      queryClient.invalidateQueries('prompt')
    },
    onError: () => {},
    onSettled: () => {},
  })
  const setServiceForDist = useMutation({
    mutationFn: (variables: { distName: string; service: string }) => {
      // console.log(`dist inside mfn = `, dist)
      return changeLMservice(variables?.distName, variables?.service)
    },
    onSuccess: data => {
      queryClient.invalidateQueries('lm_service')
    },
    onError: () => {},
    onSettled: () => {},
  })
  const setPromptForDebugDist = useMutation({
    mutationFn: (variables: { DEBUG_DIST: string; prompt: string }) => {
      return postPrompt(variables?.DEBUG_DIST, variables?.prompt)
    },
    onSuccess: data => {
      console.log(`dist = `, data)
    },
    onError: () => {},
    onSettled: () => {},
  })
  const setServiceForDebugDist = useMutation({
    mutationFn: (variables: { DEBUG_DIST: string; service: string }) => {
      // console.log(`dist inside mfn = `, dist)
      return changeLMservice(variables?.DEBUG_DIST, variables?.service)
    },
    onSuccess: data => {
      console.log(`setService = `, data)
    },
    onError: () => {},
    onSettled: () => {},
  })

  const handleSaveAndClose = () => {
    handleSubmit(data => onFormSubmit(data, true))()
  }

  useEffect(() => {
    reset({
      MODEL_ID: service?.display_name,
      PROMPT_ID: prompt?.text,
    })
  }, [service, prompt])

  useEffect(() => {
    subscribe('SkillPromptModal', handleEventUpdate)
    return () => unsubscribe('SkillPromptModal', handleEventUpdate)
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{
        overlay: {
          top: 64,
          right: 368,
          left: 448,
          position: 'fixed',
          zIndex: 1,
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
      }}>
      <form
        className={s.skillPromptModal}
        onSubmit={handleSubmit(onFormSubmit)}>
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
              defaultValue: service?.display_name,
              placeholder: 'Choose model',
              ...register(MODEL_ID, { required: true }),
            }}
            onSelect={handleModelSelect}
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
            // placeholder: prompt?.text,
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
                {/* <Button
                  theme='secondary'
                  props={{ onClick: handleBackBtnClick }}>
                  Back
                </Button> */}
                <Button theme='secondary-dark' props={{ type: 'submit' }}>
                  Save & Test
                </Button>
                <Button theme='primary' props={{ onClick: handleSaveAndClose }}>
                  Save & Close
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SkillPromptModal
