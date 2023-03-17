import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ReactComponent as HistoryIcon } from '@assets/icons/history.svg'
import { ISkill } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './SkillPromptModal.module.scss'

const mockSkillModels = ['ChatGPT', 'GPT-3.5', 'GPT-J 6B', 'BLOOMZ 7B']

type TAction = 'create' | 'edit'

interface Props {
  action?: TAction
  skill?: ISkill
}

const SkillPromptModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAction | null>(null)
  const [skill, setSkill] = useState<ISkill | null>(null)
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'all' })
  const [MODEL_ID, PROMPT_ID] = ['display_name', 'model', 'prompt']
  const promptWordsMaxLenght = 1500

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setSkill(null)
  }

  const handleBackBtnClick = () => closeModal()

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = (data: { detail: Props }) => {
    const { skill, action } = data.detail

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
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form
        className={s.skillPromptModal}
        onSubmit={handleSubmit(onFormSubmit)}>
        <h4>{skill?.display_name || 'Skill name'}</h4>
        <div className={s.top}>
          <SkillDropboxSearch
            list={mockSkillModels}
            activeItem={skill?.model}
            error={errors[MODEL_ID]}
            props={{
              placeholder: 'Choose service',
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
                <div className={s.history}>
                  <Button theme='tertiary-round'>
                    <HistoryIcon />
                    History
                  </Button>
                </div>
                <Button
                  theme='secondary'
                  props={{ onClick: handleBackBtnClick }}>
                  Back
                </Button>
                <Button
                  theme='secondary-dark'
                  props={{ type: 'submit', onClick: handleTestBtnClick }}>
                  Save & Test
                </Button>
                <Button theme='primary' props={{ type: 'submit' }}>
                  Save & Close
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </BaseModal>
  )
}

export default SkillPromptModal
