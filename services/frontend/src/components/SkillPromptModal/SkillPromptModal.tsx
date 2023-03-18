import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import { ReactComponent as HistoryIcon } from '@assets/icons/history.svg'
import { ISkill } from '../../types/types'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import DialogSidePanel from '../DialogSidePanel/DialogSidePanel'
import s from './SkillPromptModal.module.scss'

const mockSkillModels = new Map([
  [
    'ChatGPT',
    {
      text: 'ChatGPT is the GPT-3.5 model optimized for chat at 1/10th the cost of text-davinci-003. ChatGPT is available as gpt-3.5-turbo in OpenAI API on a paid basis and requiring an individual API key. It contains 175 billion parameters. ChatGPT accepts at maximum 4,096 tokens.',
      link: 'https://chat.openai.com/',
    },
  ],
  [
    'GPT-3.5',
    {
      text: 'GPT-3.5 is a language model available as text-davinci-003 in OpenAI API on a paid basis and requiring an individual API key. It contains 175 billion parameters. GPT-3.5 accepts at maximum 4,097 tokens.',
      link: 'https://beta.openai.com/playground',
    },
  ],
  [
    'GPT-J 6B',
    {
      text: 'GPT-J 6B is an open-source language model from transformers. It contains 6 billion parameters, and is 30 times smaller than GPT-3 175B while having a comparable generation quality. GPT-J 6B accepts at maximum 2,048 tokens.',
      link: 'https://huggingface.co/EleutherAI/gpt-j-6B',
    },
  ],
  [
    'BLOOMZ 7B',
    {
      text: 'BLOOMZ 7B is an open-source multilingual language model from transformers. It contains 7.1 billion parameters. BLOOMZ 7B accepts at maximum 2,048 tokens.',
      link: 'https://huggingface.co/bigscience/bloomz-7b1',
    },
  ],
])

type TAction = 'create' | 'edit'

interface Props {
  action?: TAction
  skill?: ISkill
  isOpen?: boolean
  dialogHandler?: () => void
  handleClose?: () => void
}

const SkillPromptModal = ({ dialogHandler, handleClose }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAction | null>(null)
  const [skill, setSkill] = useState<ISkill | null>(null)
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ mode: 'all' })
  const [MODEL_ID, PROMPT_ID] = ['model', 'prompt']
  const promptWordsMaxLenght = 1500
  const model = getValues()[MODEL_ID] as string
  const skillModelTip = mockSkillModels.get(model)?.text
  const skillModelLink = mockSkillModels.get(model)?.link

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
    const { skill, action } = data.detail

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

    if (dialogHandler) dialogHandler()

    trigger(BASE_SP_EVENT, {
      children: <DialogSidePanel key={skill?.name} chatWith='skill' />,
      withTransition: false,
      isClosable: false,
    })

    trigger('HelperDialogSidePanel', {})

    setAction(action ?? 'create')
    setSkill(skill ?? null)
    // Reset values and errors states
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
    }

    if (afterClose) closeModal()
  }

  const handleSaveAndClose = () => {
    handleSubmit(data => onFormSubmit(data, true))()
  }

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
        onSubmit={handleSubmit(data => onFormSubmit(data))}>
        <div className={s.top}>
          <SkillDropboxSearch
            label='Generative model:'
            list={Array.from(mockSkillModels).map(([name]) => name)}
            activeItem={model}
            error={errors[MODEL_ID]}
            props={{
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
            placeholder:
              "Hello, I'm a SpaceX Starman made by brilliant engineering team at SpaceX to tell you about the future of humanity in space and",
            defaultValue: getValues()[PROMPT_ID],
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
