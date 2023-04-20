import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useComponent } from '../../hooks/useComponent'
import { useObserver } from '../../hooks/useObserver'
import { ISkill } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { trigger } from '../../utils/events'
import { validationRules } from '../../utils/formValidate'
import s from './SkillModal.module.scss'

type TSkillModalAction = 'create' | 'copy' | 'edit'

interface ISkilltInfo
  extends Pick<ISkill, 'display_name' | 'name' | 'description'> {}

interface IParentSkillInfo extends Pick<ISkill, 'display_name' | 'name'> {}

interface SkillModalProps {
  action: TSkillModalAction
  skill?: Partial<ISkilltInfo>
  parent?: IParentSkillInfo // The skill that we copy
}
interface FormValues {
  name: string
  description: string
}
export const SkillModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TSkillModalAction | null>(null)
  const [skill, setSkill] = useState<Partial<ISkilltInfo> | null>(null)
  const [parent, setParent] = useState<IParentSkillInfo | null>(null)
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'all' })
  const [NAME_ID, DESC_ID] = ['display_name', 'description']
  const descriptionMaxLenght = 500

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setSkill(null)
    setParent(null)
  }

  /**
   * Set modal is open and getting skill info
   */
  const handleEventUpdate = ({
    detail: { action, skill, parent },
  }: {
    detail: SkillModalProps
  }) => {
    setAction(action ?? 'create')
    setSkill(skill ?? null)
    setParent(parent ?? null)
    // Reset values and errors states
    reset({
      [NAME_ID]: skill?.display_name,
      [DESC_ID]: skill?.description,
    })
    setIsOpen(!isOpen)
  }
  const { create, edit } = useComponent()

  const handleCreate = (data: any) => {
    toast.promise(
      create
        .mutateAsync({ ...data, lm_service_id: 0, prompt: 'new prompt' })
        .then(() => {
          closeModal()
          trigger('SkillsListModal', { isOpen: false })
        }),
      {
        loading: 'Creating...',
        success: 'Success!',
        error: 'Something Went Wrong...',
      }
    )
  }
  const handleEdit = (data: FormValues) => {}
  const onFormSubmit = (data: any) => {
    action === 'create' && handleCreate(data)
    action === 'edit' && handleEdit(data)
  }

  useObserver('SkillModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.skillModal}>
        <div>
          {action == 'create' && <h4>Create a new generative skill</h4>}
          {action == 'edit' && <h4>Edit skill</h4>}
          <div className={s.distribution}>
            {action == 'create' && (
              <div>
                You are creating a skill that uses{' '}
                <mark>large language models</mark>
              </div>
            )}
            {action == 'edit' && (
              <div>
                You are editing <mark>{skill?.display_name}</mark>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Input
            label='Name'
            error={errors[NAME_ID]}
            props={{
              placeholder:
                'A short name describing your Virtual Assistant’s skill',
              defaultValue: getValues()[NAME_ID],
              ...register(NAME_ID, {
                required: 'This field can’t be empty',
                validate: validationRules,
              }),
            }}
          />

          <TextArea
            label='Description'
            withCounter
            error={errors[DESC_ID]}
            maxLenght={descriptionMaxLenght} 
            props={{
              placeholder:
                'Describe your Virtual Assistant’s skill ability, where you can use it and for what purpose',
              defaultValue: getValues()[DESC_ID],
              ...register(DESC_ID, {
                required: 'This field can’t be empty',
                validate: validationRules,
                maxLength: {
                  value: descriptionMaxLenght,
                  message: `Limit text description to ${descriptionMaxLenght} characters`,
                },
              }),
            }}
          />
          <div className={s.btns}>
            <Button theme='secondary' props={{ onClick: closeModal }}>
              Cancel
            </Button>
            <Button theme='primary' props={{ type: 'submit' }}>
              {action == 'create' && 'Create'}
              {action == 'edit' && 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}
