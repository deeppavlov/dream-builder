import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import { ReactComponent as HistoryIcon } from '@assets/icons/history.svg'
import { ISkill } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import DialogSidePanel from '../DialogSidePanel/DialogSidePanel'
import s from './SkillPromptModal.module.scss'
import { RoutesList } from '../../router/RoutesList'

const mockSkillModels = ['ChatGPT', 'GPT-3.5', 'GPT-J 6B', 'BLOOMZ 7B']

type TAction = 'create' | 'edit'

interface Props {
  action?: TAction
  skill?: ISkill
  isOpen?: boolean
  dialogHandler?: () => void
}

const SkillPromptModal = ({ dialogHandler }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAction | null>(null)
  const [skill, setSkill] = useState<ISkill | null>(null)
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'all' })
  const [MODEL_ID, PROMPT_ID] = ['model', 'prompt']
  const promptWordsMaxLenght = 1500

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setSkill(null)

    trigger(BASE_SP_EVENT, { isOpen: false, withTransition: false })
    trigger('HelperDialogSidePanel', { isOpen: false })
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
      children: <DialogSidePanel key={skill?.name} start chatWith='skill' />,
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

  const onFormSubmit = (data: any) => {
    if (action === 'create') {
      handleCreate(data)
      return
    }
  }

  const handleTestBtnClick = () => {}

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
          zIndex: 2,
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
            list={mockSkillModels}
            // activeItem={skill?.model}
            error={errors[MODEL_ID]}
            props={{
              placeholder: 'Choose model',
              ...register(MODEL_ID, { required: true }),
            }}
            onSelect={handleModelSelect}
          />
          <p className={s.tip}>
            <span className={s['tip-bold']}>
              Keep in mind how to modify promt for the modal:
            </span>
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus
            turpis odio, dictum egestas enim scelerisque ac. Praesent quis enim
            nisi. Etiam ut imperdiet enim, at vulputate ipsum. Quisque pulvinar
            tempor mollis. Etiam in lorem a massa pellentesque ornare bibendum
            in lorem. Nunc mattis libero tellus, eu porta massa tempus nec.
          </p>
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
                {/* <div className={s.history}>
                  <Button theme='tertiary-round'>
                    <HistoryIcon />
                    History
                  </Button>
                </div> */}
                {/* <Button
                  theme='secondary'
                  props={{ onClick: handleBackBtnClick }}>
                  Back
                </Button> */}
                <Button
                  theme='secondary-dark'
                  props={{ type: 'submit', onClick: handleTestBtnClick }}>
                  Save & Test
                </Button>
                {/* <Button theme='primary' props={{ type: 'submit' }}>
                  Save & Close
                </Button> */}
              </>
            )}
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SkillPromptModal
